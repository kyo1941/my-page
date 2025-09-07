import Header from "../header";
import ProfileDetailSection from "../components/profile/ProfileDetailSection";
import CareerSection from "../components/profile/CareerSection";
import SkillsSection from "../components/profile/SkillsSection";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">

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

