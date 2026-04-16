---
name: ssr-dal
description: SSR ページの Repository 直叩きを Data Access Layer (DAL) にリファクタリングする
allowed-tools: Read, Edit, Write, Glob, Grep, Bash(pnpm *), Bash(git *)
---

Next.js の SSR ページ (`page.tsx`) から Repository を直接 `await` で呼び出しているコードを、
Data Access Layer (DAL) パターンにリファクタリングします。

## 背景

Next.js 公式ドキュメントは DAL パターンを推奨しています。
UI 層 (`page.tsx`) が Repository 層に直接依存すると、関心の分離・テスト容易性・再利用性が損なわれます。

### 目標アーキテクチャ

```
page.tsx
  └── lib/data/<feature>.ts   ← DAL (Data Access Layer)
        └── repository/<feature>Repository.ts
              └── Backend API
```

## 手順

### 1. 対象ファイルの洗い出し

Grep で `frontend/src/app/ui/**/page.tsx` 内の `from "@/app/repository/` を検索し、
Repository を直接 import している page.tsx を特定する。

### 2. `server-only` パッケージのインストール確認

`frontend/package.json` に `server-only` が含まれていなければインストールする:

```bash
cd frontend && pnpm add server-only
```

### 3. DAL ファイルの作成

`frontend/src/app/lib/data/` ディレクトリに feature 単位でファイルを作成する。

**ファイル命名規則**: `<feature>.ts` (例: `blog.ts`, `portfolio.ts`)

#### 作成ルール

- ファイル先頭に `import "server-only";` を記述し、クライアントコンポーネントからの誤用を防ぐ
- 関数名は `fetch<Resource>` 形式 (例: `fetchBlogList`, `fetchBlogPost`, `fetchBlogSlugs`)
- Repository のシングルトンをそのまま呼び出す薄いラッパーにする
- 引数・戻り値の型は Repository のメソッドシグネチャに従う

#### 例: `frontend/src/app/lib/data/blog.ts`

```typescript
import "server-only";
import { blogRepository } from "@/app/repository/blogRepository";
import { tagRepository } from "@/app/repository/tagRepository";

export async function fetchBlogList() {
  return blogRepository.getSortedPostsData();
}

export async function fetchBlogListWithLimit(limit: number) {
  return blogRepository.getSortedPostsData({ limit });
}

export async function fetchBlogPost(slug: string) {
  return blogRepository.getPostData(slug);
}

export async function fetchBlogSlugs() {
  return blogRepository.getAllPostSlugs();
}

export async function fetchTagList() {
  return tagRepository.getAll();
}
```

#### 例: `frontend/src/app/lib/data/portfolio.ts`

```typescript
import "server-only";
import { portfolioRepository } from "@/app/repository/portfolioRepository";

export async function fetchPortfolioList() {
  return portfolioRepository.getSortedPostsData();
}

export async function fetchPortfolioPost(slug: string) {
  return portfolioRepository.getPostData(slug);
}

export async function fetchPortfolioSlugs() {
  return portfolioRepository.getAllPostSlugs();
}
```

#### 例: `frontend/src/app/lib/data/ogp.ts`

`ogpRepository` も DAL に含める。URL 抽出 (`extractBareUrls`) まで DAL 内に閉じ込めることで、
page.tsx は記事コンテンツを渡すだけでよくなる。

```typescript
import "server-only";
import { ogpRepository } from "@/app/repository/ogpRepository";
import { extractBareUrls } from "@/app/utils/extractBareUrls";

export async function fetchOgpForContent(content: string) {
  const urls = extractBareUrls(content);
  return ogpRepository.fetchOgpBatch(urls);
}
```

### 4. page.tsx の修正

各 page.tsx で以下の変更を行う:

1. `import { xxxRepository } from "@/app/repository/xxxRepository"` を削除
2. `import { fetch<Resource> } from "@/app/lib/data/<feature>"` に置き換える
3. `await xxxRepository.method()` を `await fetch<Resource>()` に置き換える

`generateStaticParams` 内の Repository 呼び出しも同様に DAL 経由に変更すること。

#### 修正例 (`top/page.tsx`)

```typescript
// Before
import { blogRepository } from "@/app/repository/blogRepository";
const blogs = await blogRepository.getSortedPostsData({ limit: 3 });

// After
import { fetchBlogListWithLimit } from "@/app/lib/data/blog";
const blogs = await fetchBlogListWithLimit(3);
```

#### 修正例 (`blog/[slug]/page.tsx`)

```typescript
// Before
import { ogpRepository } from "@/app/repository/ogpRepository";
import { extractBareUrls } from "@/app/utils/extractBareUrls";
const ogpData = postData
  ? await ogpRepository.fetchOgpBatch(extractBareUrls(postData.content))
  : {};

// After
import { fetchOgpForContent } from "@/app/lib/data/ogp";
const ogpData = postData ? await fetchOgpForContent(postData.content) : {};
```

### 5. ビルド確認

```bash
cd frontend && pnpm build
```

エラーがあれば修正してから次へ進む。

### 7. Lint チェック

```bash
cd frontend && pnpm check
```
