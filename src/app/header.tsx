import React from "react";
import styles from "./header.module.css";

export default function Header() {
  return (
    <header className={styles["header-root"]}>
      <a href="/" className={styles["header-title"]}>kyo1941</a>
      <nav>
        <ul className={styles["header-nav-list"]}>
          <li><a href="#" className={styles["header-nav-link"]}>自己紹介</a></li>
          <li><a href="#" className={styles["header-nav-link"]}>ブログ</a></li>
          <li><a href="#" className={styles["header-nav-link"]}>ポートフォリオ</a></li>
        </ul>
      </nav>
    </header>
  );
}
