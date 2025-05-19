import React from "react";
import Link from 'next/link'
import styles from "./header.module.css";

export default function Header() {
  return (
    <header className={styles["header-root"]}>
      <Link href="/" className={styles["header-title"]}>kyo1941</Link>
      <nav>
        <ul className={styles["header-nav-list"]}>
          <li><Link href="#" className={styles["header-nav-link"]}>自己紹介</Link></li>
          <li><Link href="#" className={styles["header-nav-link"]}>ブログ</Link></li>
          <li><Link href="#" className={styles["header-nav-link"]}>ポートフォリオ</Link></li>
        </ul>
      </nav>
    </header>
  );
}
