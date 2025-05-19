import React from "react";
import Link from 'next/link'
import styles from "./header.module.css";

export default function Header() {
  const navItems = [
    { id: 'profile', link: '#', label: '自己紹介' },
    { id: 'blog', link: '#', label: 'ブログ' },
    { id: 'portfolio', link: '#', label: 'ポートフォリオ' },
  ];
  
  return (
    <header className={styles["header-root"]}>
      <Link href="/" className={styles["header-title"]}>kyo1941</Link>
      <nav>
        <ul className={styles["header-nav-list"]}>
          {navItems.map(item => (
            <li key={item.id}>
              <Link href={item.link} className={styles["header-nav-link"]}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
