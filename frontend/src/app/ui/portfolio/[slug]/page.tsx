export const revalidate = false;

import {
  fetchPortfolioPost,
  fetchPortfolioSlugs,
} from "@/app/lib/data/portfolio";
import { fetchOgpForContent } from "@/app/lib/data/ogp";
import PageShell from "@/app/components/PageShell";
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
      <PageShell>
        <div className="sky-surface p-12 text-center">
          <div className="mb-8 text-left">
            <BackButton fallbackPath={ROUTES.PORTFOLIO} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            ポートフォリオが見つかりませんでした。
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
          <BackButton fallbackPath={ROUTES.PORTFOLIO} />
        </div>

        {/* タイトル */}
        <h1 className="text-4xl font-bold mb-4 text-gray-900">
          {portfolioData.title}
        </h1>

        {/* 投稿日 */}
        <div className="text-gray-600 mb-8">{portfolioData.date}</div>

        {/* 本文 (ReactMarkdownでレンダリング) */}
        <div className="prose prose-lg max-w-none">
          <MarkdownRenderer content={portfolioData.content} ogpData={ogpData} />
        </div>
      </article>
    </PageShell>
  );
}
