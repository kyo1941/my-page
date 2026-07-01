import PageShell from "../../components/PageShell";
import WelcomeSection from "./section/WelcomeSection";
import ProfileSection from "./section/ProfileSection";
import BlogListSection from "./section/BlogListSection";
import ContactForm from "./section/ContactFormSection";
import { fetchBlogListWithLimit } from "@/app/lib/data/blog";

export default async function Home() {
  const blogs = await fetchBlogListWithLimit(3);
  return (
    <PageShell>
      {/* 初回画面: 挨拶＋プロフィール（アイコン/Zenn）で 1 画面を占め、
          スクロールするまで以降のセクションは見えないようにする。
          ここはカードに入れず空に直接浮かべる。 */}
      <section className="relative flex min-h-[calc(100dvh-6rem)] flex-col justify-center gap-10 sm:gap-14">
        <WelcomeSection />
        <ProfileSection />

        {/* 下にコンテンツがあることを示す控えめなスクロール誘導 */}
        <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center">
          <svg
            className="h-6 w-6 text-sky-700/50 motion-safe:animate-bounce"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </section>

      {/* サーフェスなし。コンテンツを背景の空に直接置く。
          以前サーフェスの p-8 sm:p-12 が担っていた横幅の絞り込みは
          見た目の幅を変えないよう px-8 sm:px-12 として残す */}
      <div className="px-8 sm:px-12">
        <div className="space-y-24 sm:space-y-32">
          <BlogListSection blogs={blogs} />

          {/* TODO: 成果物も簡単な見出しを作成しておく。詳しい内容は専用のページに遷移させる。 */}

          <ContactForm />
        </div>
      </div>
    </PageShell>
  );
}
