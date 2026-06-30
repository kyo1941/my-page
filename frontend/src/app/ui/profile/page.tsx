import PageShell from "@/app/components/PageShell";
import ProfileDetailSection from "./section/ProfileDetailSection";
import CareerSection from "./section/CareerSection";
import SkillsSection from "./section/SkillsSection";

export default function AboutPage() {
  return (
    <PageShell>
      {/* サーフェスなし。コンテンツを背景の空に直接置く。
          以前サーフェスの p-8 sm:p-12 が担っていた横幅の絞り込みは
          見た目の幅を変えないよう px-8 sm:px-12 として残す */}
      <div className="px-8 sm:px-12">
        <h1 className="text-on-sky-subtle text-3xl font-bold mb-8 text-gray-900">
          プロフィール
        </h1>
        <div className="space-y-16">
          <ProfileDetailSection />
          <CareerSection />
          <SkillsSection />
        </div>
      </div>
    </PageShell>
  );
}
