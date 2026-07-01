import PageShell from "@/app/components/PageShell";
import ProfileDetailSection from "./section/ProfileDetailSection";
import CareerSection from "./section/CareerSection";
import SkillsSection from "./section/SkillsSection";

export default function AboutPage() {
  return (
    <PageShell>
      {/* サーフェスなし。コンテンツを背景の空に直接置く。
          以前サーフェスの p-8 sm:p-12 が担っていた横幅の絞り込みと上余白は
          見た目を変えないよう px-8 sm:px-12 / pt-8 sm:pt-12 として残す */}
      <div className="px-8 pt-8 sm:px-12 sm:pt-12">
        <h1 className="text-on-sky-subtle text-3xl font-bold mb-8 text-gray-900">
          プロフィール
        </h1>
        <div className="space-y-24 sm:space-y-32">
          <ProfileDetailSection />
          <CareerSection />
          <SkillsSection />
        </div>
      </div>
    </PageShell>
  );
}
