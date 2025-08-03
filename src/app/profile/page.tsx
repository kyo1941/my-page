import Header from "../header";

import CareerSection from "../components/CareerSection";
import SkillsSection from "../components/SkillsSection";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <section className="border-b border-gray-200 pb-12 mb-12">
            <h1 className="text-4xl font-bold mb-8 text-gray-900">自己紹介</h1>
            <div className="prose max-w-none prose-lg">
              <p className="text-gray-700 leading-relaxed mb-6">
                こんにちは、kyo1941です。
              </p>
              <p className="text-gray-700 leading-relaxed mb-6">
                ここに詳細な自己紹介を記載します。
              </p>
            </div>
          </section>

          <section className="border-b border-gray-200 pb-12 mb-12">
            <CareerSection />
          </section>

          <section>
            <SkillsSection />
          </section>
        </div>
      </main>
    </div>
  );
}

