export const revalidate = false;

import { fetchBlogPost, fetchBlogSlugs } from "@/app/lib/data/blog";
import { fetchOgpForContent } from "@/app/lib/data/ogp";
import { MarkdownDetailPage } from "@/app/components/MarkdownDetailPage";
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

  return (
    <MarkdownDetailPage
      data={postData}
      ogpData={ogpData}
      fallbackPath={ROUTES.BLOG}
      notFoundMessage="記事が見つかりませんでした。"
    />
  );
}
