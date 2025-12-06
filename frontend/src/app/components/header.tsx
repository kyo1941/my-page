import React from "react";
import Link from 'next/link';
import { ROUTES } from '@/app/routes';

export default function Header() {
    const navItems = [
        { id: 'profile', link: ROUTES.PROFILE, label: '自己紹介' },
        { id: 'blog', link: ROUTES.BLOG, label: 'ブログ' },
        { id: 'portfolio', link: ROUTES.PORTFOLIO, label: 'ポートフォリオ' },
    ];

    const underlineStyle = "transition-all duration-200 hover:underline hover:decoration-2 hover:underline-offset-2 hover:text-foreground";

    return (
        <header className="w-full border-b border-gray-200 bg-gray-200">
            <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                <Link href={ROUTES.HOME} className={`text-2xl font-bold text-gray-900 ${underlineStyle}`}>kyo1941</Link>
                <nav>
                    <ul className="flex gap-8 text-gray-900 text-base font-semibold">
                        {navItems.map(item => (
                            <li key={item.id}>
                                <Link href={item.link} className={`no-underline text-inherit ${underlineStyle}`}>
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
