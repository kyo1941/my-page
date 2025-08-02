import Image from "next/image";
import Header from "./header";
import WelcomeSection from "./components/WelcomeSection";
import ProfileSection from "./components/ProfileSection";
import BlogListSection from "./components/BlogListSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <WelcomeSection />
        <ProfileSection />
        <BlogListSection />
      </main>
    </div>
  );
}
