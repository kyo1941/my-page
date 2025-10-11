import Header from "../header";
import WelcomeSection from "./section/WelcomeSection";
import ProfileSection from "./section/ProfileSection";
import BlogListSection from "./section/BlogListSection";
import ContactForm from "./section/ContactFormSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          
          <section className="border-b border-gray-200 mt-12 pb-12 text-center">
            <WelcomeSection />
          </section>
          
          <section className="border-b border-gray-200 mt-16 pb-16">
            <ProfileSection />
          </section>

          <section className="border-b border-gray-200 mt-16 pb-16">
            <BlogListSection />
          </section>

          {/* TODO: 成果物も簡単な見出しを作成しておく。詳しい内容は専用のページに遷移させる。 */}

          <section className="mt-16 pb-16">
            <ContactForm />
          </section>
        </div>

      </main>
    </div>
  );
}
