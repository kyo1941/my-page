import React from "react";
import Link from 'next/link'

export default function Header() {
  const navItems = [
    { id: 'profile', link: '#', label: '自己紹介' },
    { id: 'blog', link: '#', label: 'ブログ' },
    { id: 'portfolio', link: '#', label: 'ポートフォリオ' },
  ];
  
  return (
    <header className="w-full flex items-center justify-between px-8 py-4 border-b border-border font-sans bg-light-gray">
      <Link href="/" className="text-2xl font-bold text-foreground">kyo1941</Link>
      <nav>
        <ul className="flex gap-8 text-foreground text-base font-medium">
          {navItems.map(item => (
            <li key={item.id}>
              <Link href={item.link} className="no-underline text-inherit transition-all duration-200 hover:underline hover:text-foreground">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
