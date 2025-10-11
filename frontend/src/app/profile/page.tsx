import Header from "../header";
import ProfileDetailSection from "./section/ProfileDetailSection";
import CareerSection from "./section/CareerSection";
import SkillsSection from "./section/SkillsSection";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">

          <h1 className="text-4xl font-bold mb-8 text-gray-900">自己紹介</h1>

          <section className="border-b border-gray-200 pb-12 mb-12">
            <ProfileDetailSection />
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

