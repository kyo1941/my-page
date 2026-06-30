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
      <section className="border-b border-gray-200 mt-12 pb-12 text-center">
        <WelcomeSection />
      </section>

      <section className="border-b border-gray-200 mt-16 pb-16">
        <ProfileSection />
      </section>

      <section className="border-b border-gray-200 mt-16 pb-16">
        <BlogListSection blogs={blogs} />
      </section>

      {/* TODO: 成果物も簡単な見出しを作成しておく。詳しい内容は専用のページに遷移させる。 */}

      <section className="mt-16 pb-16">
        <ContactForm />
      </section>
    </PageShell>
  );
}
