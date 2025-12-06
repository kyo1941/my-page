import React from "react";
import Link from 'next/link';
import { ROUTES } from '@/app/routes';

const animatedUnderline = `
  relative
  text-gray-900
  transition-colors duration-200
  hover:text-foreground
  after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-current
  motion-safe:after:transition-all motion-safe:after:duration-200
  motion-reduce:after:transition-none
  hover:after:w-full focus-visible:after:w-full
`;

export default function Header() {
    const navItems = [
        { id: 'profile', link: ROUTES.PROFILE, label: '自己紹介' },
        { id: 'blog', link: ROUTES.BLOG, label: 'ブログ' },
        { id: 'portfolio', link: ROUTES.PORTFOLIO, label: 'ポートフォリオ' },
    ];

    return (
        <header className="w-full border-b border-gray-200 bg-gray-200 font-sans">
            <div className="max-w-4xl w-full mx-auto px-4 py-4 flex items-center justify-between">
                <Link href={ROUTES.HOME} className="text-2xl font-bold transition-opacity hover:opacity-70">kyo1941</Link>
                <nav>
                    <ul className="flex gap-8 text-base font-semibold">
                        {navItems.map(item => (
                            <li key={item.id}>
                                <Link href={item.link} className={`no-underline text-inherit ${animatedUnderline}`}>
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </header>
    );
}