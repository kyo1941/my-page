export const revalidate = false;

import { fetchBlogPost, fetchBlogSlugs } from "@/app/lib/data/blog";
import { fetchOgpForContent } from "@/app/lib/data/ogp";
import PageShell from "@/app/components/PageShell";
import BackButton from "@/app/components/BackButton";
import { MarkdownRenderer } from "@/app/components/MarkdownRenderer";
import { ROUTES } from "@/app/routes";

// ブログページの生成に必要なパスを事前に取得する関数
export async function generateStaticParams() {
  const paths = await fetchBlogSlugs();
  return paths.map((path) => ({
    slug: path.params.slug,
  }));
}

// ページ本体のコンポーネント
export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const postData = await fetchBlogPost(slug);
  const ogpData = postData ? await fetchOgpForContent(postData.content) : {};

  if (!postData) {
    return (
      <PageShell>
        <div className="sky-surface p-12 text-center">
          <div className="mb-8 text-left">
            <BackButton fallbackPath={ROUTES.BLOG} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            記事が見つかりませんでした。
            <br />
            お探しのページは存在しないか、削除された可能性があります。
          </h1>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      {/* 長文を読ませるページなので、可読性を優先してサーフェス（背景）をつける。
          戻るボタンも同じ面に含める従来のデザインに合わせる */}
      <article className="sky-surface p-8 sm:p-12">
        <div className="mb-8">
          <BackButton fallbackPath={ROUTES.BLOG} />
        </div>

        {/* 記事タイトル */}
        <h1 className="text-4xl font-bold mb-4 text-gray-900">
          {postData.title}
        </h1>

        {/* 投稿日 */}
        <div className="text-gray-600 mb-8">{postData.date}</div>

        {/* 本文 (ReactMarkdownでレンダリング) */}
        <div className="prose prose-lg max-w-none">
          <MarkdownRenderer content={postData.content} ogpData={ogpData} />
        </div>
      </article>
    </PageShell>
  );
}
