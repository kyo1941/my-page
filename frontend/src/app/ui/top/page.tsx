import PageShell from "../../components/PageShell";
import WelcomeSection from "./section/WelcomeSection";
import BlogListSection from "./section/BlogListSection";
import ContactForm from "./section/ContactFormSection";
import { fetchBlogListWithLimit } from "@/app/lib/data/blog";

export default async function Home() {
  const blogs = await fetchBlogListWithLimit(3);
  return (
    <PageShell>
      <WelcomeSection />

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
