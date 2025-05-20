import styles from "../page.module.css";

export default function WelcomeSection() {
    return (
        <section className={`${styles["top-section"]} ${styles["welcome-section"]}`}> 
          <h2 className={styles["welcome-title"]}>ようこそ、kyo1941のサイトへ</h2>
          <p className={styles["welcome-desc"]}>何気ない日常や開発についてのんびりと記録していきます。</p>
        </section>
    );
}