import Link from "next/link";
import styles from "../page.module.css";
import { getBlogs } from "../data/blogData";

export default function BlogListSection() {
  const blogs = getBlogs().slice(0, 3);

  return (
    <section className={`${styles["top-section"]} ${styles["blog-section"]}`}>
      <h3 className={styles["blog-title"]}>最新ブログ</h3>
      <div className={styles["blog-list-grid"]}>
        {blogs.length === 0 ? (
          <div className={styles["blog-list-empty"]}>
            記事がまだありません。
          </div>
        ) : (
          blogs.map((blog) => (
            <div className={styles["blog-card"]} key={blog.id}>
              <h4 className={styles["blog-card-title"]}>{blog.title}</h4>
              <p className={styles["blog-card-date"]}>{blog.date}</p>
              <p className={styles["blog-card-desc"]}>{blog.description}</p>
              <Link href={blog.url} className={styles["blog-card-link"]}>続きを読む</Link>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
