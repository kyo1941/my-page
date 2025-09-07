import React from "react";
import Link from 'next/link';
import { ROUTES } from './routes';

export default function Header() {
  const navItems = [
    { id: 'profile', link: ROUTES.PROFILE, label: '自己紹介' },
    { id: 'blog', link: ROUTES.BLOG, label: 'ブログ' },
    { id: 'portfolio', link: ROUTES.PORTFOLIO, label: 'ポートフォリオ' },
  ];
  
  return (
    <header className="w-full flex items-center justify-between px-8 py-4 border-b border-gray-200 font-sans bg-gray-200">
      <Link href={ROUTES.HOME} className="text-2xl font-bold text-gray-900 transition-opacity hover:opacity-70">kyo1941</Link>
      <nav>
        <ul className="flex gap-8 text-gray-900 text-base font-semibold">
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
