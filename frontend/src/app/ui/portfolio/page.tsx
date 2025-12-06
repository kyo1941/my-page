import Header from "@/app/components/header";
import PortfolioListSection from "./section/PortfolioListSection";

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">

          <h1 className="text-4xl font-bold mb-8 text-gray-900">ポートフォリオ</h1>

          <section>
            <PortfolioListSection />
          </section>
        </div>
      </main>
    </div>
  );
}