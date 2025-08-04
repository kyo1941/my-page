import Image from "next/image";
import Header from "./header";
import WelcomeSection from "./components/top/WelcomeSection";
import ProfileSection from "./components/top/ProfileSection";
import BlogListSection from "./components/top/BlogListSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          
          <section className="border-b border-gray-200 pb-12 my-12 text-center">
            <WelcomeSection />
          </section>
          
          <section className="border-b border-gray-200 pb-16 my-16">
            <ProfileSection />
          </section>

          <section className="pb-16">
            <BlogListSection />
          </section>
        </div>
      </main>
    </div>
  );
}
