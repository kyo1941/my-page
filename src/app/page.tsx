import Image from "next/image";
import Header from "./header";
import styles from "./page.module.css";
import WelcomeSection from "./components/WelcomeSection";
import ProfileSection from "./components/ProfileSection";
import BlogListSection from "./components/BlogListSection";

export default function Home() {
  return (
    <div className={styles["page-root"]}>
      <Header />
      <main className={styles["page-main"]}>
        <WelcomeSection />
        <ProfileSection />
        <BlogListSection />
      </main>
    </div>
  );
}
