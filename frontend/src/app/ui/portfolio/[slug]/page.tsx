export const revalidate = false;

import {
  fetchPortfolioPost,
  fetchPortfolioSlugs,
} from "@/app/lib/data/portfolio";
import { fetchOgpForContent } from "@/app/lib/data/ogp";
import Header from "@/app/components/header";
import BackButton from "@/app/components/BackButton";
import { MarkdownRenderer } from "@/app/components/MarkdownRenderer";
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

  if (!portfolioData) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans">
        <Header />
        <main id="main-content" className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="mb-8">
              <BackButton fallbackPath={ROUTES.PORTFOLIO} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 text-center py-40">
              ポートフォリオが見つかりませんでした。
              <br />
              お探しのページは存在しないか、削除された可能性があります。
            </h1>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      <main id="main-content" className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="mb-8">
            <BackButton fallbackPath={ROUTES.PORTFOLIO} />
          </div>

          <article>
            {/* タイトル */}
            <h1 className="text-4xl font-bold mb-4 text-gray-900">
              {portfolioData.title}
            </h1>

            {/* 投稿日 */}
            <div className="text-gray-600 mb-8">{portfolioData.date}</div>

            {/* 本文 (ReactMarkdownでレンダリング) */}
            <div className="prose prose-lg max-w-none">
              <MarkdownRenderer
                content={portfolioData.content}
                ogpData={ogpData}
              />
            </div>
          </article>
        </div>
      </main>
    </div>
  );
}
