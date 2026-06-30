export const revalidate = false;

import Header from "@/app/components/header";
import PortfolioListSection from "./section/PortfolioListSection";
import { fetchPortfolioList } from "@/app/lib/data/portfolio";

export default async function PortfolioPage() {
  const portfolios = await fetchPortfolioList();

  return (
    <div className="min-h-screen font-sans">
      <Header />
      <main id="main-content" className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl ring-1 ring-white/40 p-8">
          <h1 className="text-4xl font-bold mb-8 text-gray-900">
            ポートフォリオ
          </h1>

          <section>
            <PortfolioListSection portfolios={portfolios} />
          </section>
        </div>
      </main>
    </div>
  );
}
