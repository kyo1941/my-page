export const revalidate = false;

import PageShell from "@/app/components/PageShell";
import PortfolioListSection from "./section/PortfolioListSection";
import { fetchPortfolioList } from "@/app/lib/data/portfolio";

export default async function PortfolioPage() {
  const portfolios = await fetchPortfolioList();

  return (
    <PageShell>
      {/* サーフェスなし。コンテンツを背景の空に直接置く。
          以前サーフェスの p-8 sm:p-12 が担っていた横幅の絞り込みと上余白は
          見た目を変えないよう px-8 sm:px-12 / pt-8 sm:pt-12 として残す */}
      <section className="px-8 pt-8 sm:px-12 sm:pt-12">
        <h1 className="text-on-sky-subtle text-3xl font-bold mb-8 text-gray-900">
          ポートフォリオ
        </h1>
        <PortfolioListSection portfolios={portfolios} />
      </section>
    </PageShell>
  );
}
