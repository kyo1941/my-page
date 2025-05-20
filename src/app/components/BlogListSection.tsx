import styles from "../page.module.css";

export default function BlogListSection() {
  return (
    <section className={`${styles["top-section"]} ${styles["blog-section"]}`}>
      <h3 className="text-2xl font-bold mb-6">最新ブログ</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={styles["blog-card"]}>
          <h4 className={styles["blog-card-title"]}>初めての個人サイト制作</h4>
          <p className={styles["blog-card-date"]}>2025年5月17日</p>
          <p className={styles["blog-card-desc"]}>個人サイトを作ることになった経緯とその過程で学んだことについて…</p>
          <a href="#" className={styles["blog-card-link"]}>続きを読む</a>
        </div>
        <div className={styles["blog-card"]}>
          <h4 className={styles["blog-card-title"]}>HTMLとCSSの基本</h4>
          <p className={styles["blog-card-date"]}>2025年5月10日</p>
          <p className={styles["blog-card-desc"]}>Webページの基本構造とスタイリングについて学んだことをまとめました…</p>
          <a href="#" className={styles["blog-card-link"]}>続きを読む</a>
        </div>
        <div className={styles["blog-card"]}>
          <h4 className={styles["blog-card-title"]}>レスポンシブデザインとは</h4>
          <p className={styles["blog-card-date"]}>2025年5月3日</p>
          <p className={styles["blog-card-desc"]}>様々な画面サイズに対応するWebサイトの作り方について…</p>
          <a href="#" className={styles["blog-card-link"]}>続きを読む</a>
        </div>
      </div>
    </section>
  );
}
