export const revalidate = false;

import PageShell from "@/app/components/PageShell";
import PortfolioListSection from "./section/PortfolioListSection";
import { fetchPortfolioList } from "@/app/lib/data/portfolio";

export default async function PortfolioPage() {
  const portfolios = await fetchPortfolioList();

  return (
    <PageShell>
      <h1 className="text-4xl font-bold mb-8 text-gray-900">ポートフォリオ</h1>

      <section>
        <PortfolioListSection portfolios={portfolios} />
      </section>
    </PageShell>
  );
}
