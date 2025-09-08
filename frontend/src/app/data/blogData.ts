import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { parseDate } from '../utils/parseDate';

const postsDirectory = path.join(process.cwd(), '_post');

export type Blog = {
  slug: string; // ファイル名から自動で生成する
  title: string;
  date: string;
  description: string;
  coverImage: string | undefined;
  tags: string[];
  content: string;
};

// すべての記事のメタデータを取得する関数
export function getSortedPostsData() {
  // _postsディレクトリ内のファイル名を取得
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    // ファイル名から ".md" を取り除いてslugを作成
    const slug = fileName.replace(/\.md$/, '');

    // Markdownファイルを文字列として読み込む
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // gray-matterでメタデータをパース
    const matterResult = matter(fileContents);

    // 必要なデータを結合して返す
    return {
      slug,
      ...(matterResult.data as {
        title: string;
        date: string;
        description: string;
        coverImage: string;
        tags: string[];
      }),
    };
  });

  // 記事を日付順にソート
  return allPostsData.sort((a, b) => {
  const dateA = parseDate(a.date);
  const dateB = parseDate(b.date);
  
  return dateB.getTime() - dateA.getTime();
});
}

// すべての記事のslugを取得する関数 (動的ルーティング用)
export function getAllPostSlugs() {
  const fileNames = fs.readdirSync(postsDirectory);
  // [{ params: { slug: 'my-first-post' } }, ...] のような形式の配列を返す
  return fileNames.map((fileName) => {
    return {
      params: {
        slug: fileName.replace(/\.md$/, ''),
      },
    };
  });
}

// 特定のslugの記事データを取得する関数
export async function getPostData(slug: string): Promise<Blog> {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // gray-matterでメタデータと本文をパース
  const matterResult = matter(fileContents);
  
  // 本文はここではまだMarkdownのまま
  const content = matterResult.content;

  return {
    slug,
    content,
    ...(matterResult.data as {
      title: string;
      date: string;
      description: string;
      coverImage: string;
      tags: string[];
    }),
  };
}