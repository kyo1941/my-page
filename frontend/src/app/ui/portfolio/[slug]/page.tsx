export const revalidate = false;

import {
  fetchPortfolioPost,
  fetchPortfolioSlugs,
} from "@/app/lib/data/portfolio";
import { fetchOgpForContent } from "@/app/lib/data/ogp";
import { MarkdownDetailPage } from "@/app/components/MarkdownDetailPage";
import { ROUTES } from "@/app/routes";

// ポートフォリオページの生成に必要なパスを事前に取得する関数
export async function generateStaticParams() {
  const paths = await fetchPortfolioSlugs();
  return paths.map((path) => ({
    slug: path.params.slug,
  }));
}

// ページ本体のコンポーネント
export default async function PortfolioDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const portfolioData = await fetchPortfolioPost(slug);
  const ogpData = portfolioData
    ? await fetchOgpForContent(portfolioData.content)
    : {};

  return (
    <MarkdownDetailPage
      data={portfolioData}
      ogpData={ogpData}
      fallbackPath={ROUTES.PORTFOLIO}
      notFoundMessage="ポートフォリオが見つかりませんでした。"
    />
  );
}
