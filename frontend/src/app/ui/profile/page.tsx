import PageShell from "@/app/components/PageShell";
import ProfileDetailSection from "./section/ProfileDetailSection";
import CareerSection from "./section/CareerSection";
import SkillsSection from "./section/SkillsSection";

export default function AboutPage() {
  return (
    <PageShell>
      <h1 className="text-4xl font-bold mb-8 text-gray-900">プロフィール</h1>

      <section className="border-b border-gray-200 pb-12 mb-12">
        <ProfileDetailSection />
      </section>

      <section className="border-b border-gray-200 pb-12 mb-12">
        <CareerSection />
      </section>

      <section>
        <SkillsSection />
      </section>
    </PageShell>
  );
}
