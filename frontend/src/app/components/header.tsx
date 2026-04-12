"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/app/routes";

const baseNavLink = `
  relative
  text-gray-900
  transition-colors duration-200
  after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-current
`;

const animatedUnderline = `
  ${baseNavLink}
  after:w-0
  motion-safe:after:transition-all motion-safe:after:duration-200
  motion-reduce:after:transition-none
  hover:after:w-full focus-visible:after:w-full
`;

const activeUnderline = `
  ${baseNavLink}
  after:w-full
  motion-safe:after:transition-all motion-safe:after:duration-200
  motion-reduce:after:transition-none
`;

const navItems = [
  { id: "home", link: ROUTES.HOME, label: "ホーム" },
  { id: "profile", link: ROUTES.PROFILE, label: "プロフィール" },
  { id: "blog", link: ROUTES.BLOG, label: "ブログ" },
  { id: "portfolio", link: ROUTES.PORTFOLIO, label: "ポートフォリオ" },
];

function isActivePath(pathname: string | null, link: string): boolean {
  if (!pathname) return false;
  if (link === ROUTES.HOME) {
    return pathname === "/";
  }
  return pathname === link || pathname.startsWith(link + "/");
}

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";

    // Disable interactions on main content when drawer is open
    const mainContent = document.getElementById("main-content");
    if (mainContent) {
      if (isOpen) {
        mainContent.style.pointerEvents = "none";
      } else {
        mainContent.style.pointerEvents = "auto";
      }
    }

    return () => {
      document.body.style.overflow = "auto";
      if (mainContent) {
        mainContent.style.pointerEvents = "auto";
      }
    };
  }, [isOpen]);

  return (
    <header className="sticky top-0 w-full border-b border-gray-200 bg-gray-200 font-sans z-30">
      <div className="max-w-4xl w-full mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          href={ROUTES.HOME}
          className="text-2xl font-bold text-gray-900 transition-opacity hover:opacity-70"
        >
          kyo1941
        </Link>
        <nav className="hidden md:flex">
          <ul className="flex gap-8 text-base font-semibold">
            {navItems.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.link}
                  className={`no-underline ${isActivePath(pathname, item.link) ? activeUnderline : animatedUnderline}`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        {/* Hamburger button (open only) */}
        <button
          className="md:hidden flex flex-col justify-center gap-1.5 w-8 h-8"
          onClick={() => setIsOpen(true)}
          aria-label="メニューを開く"
          aria-expanded={isOpen}
        >
          <span className="block h-0.5 w-full bg-gray-900" />
          <span className="block h-0.5 w-full bg-gray-900" />
          <span className="block h-0.5 w-full bg-gray-900" />
        </button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/30 z-overlay"
          onClick={closeMenu}
        />
      )}

      {/* Side drawer */}
      <div
        className={`md:hidden fixed top-0 right-0 h-full w-64 bg-gray-200/70 backdrop-blur-sm z-drawer transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Close button */}
        <div className="flex justify-end px-4 py-4">
          <button
            onClick={closeMenu}
            aria-label="メニューを閉じる"
            className="flex flex-col justify-center gap-1.5 w-8 h-8"
          >
            <span className="block h-0.5 w-full bg-gray-900 rotate-45 translate-y-2" />
            <span className="block h-0.5 w-full bg-gray-900 opacity-0" />
            <span className="block h-0.5 w-full bg-gray-900 -rotate-45 -translate-y-2" />
          </button>
        </div>
        <ul className="flex flex-col">
          {navItems.map((item) => (
            <li
              key={item.id}
              className="mx-6 border-b border-gray-400 last:border-b-0"
            >
              <Link
                href={item.link}
                onClick={closeMenu}
                className="block -mx-6 px-6 py-4 no-underline text-gray-900 text-base font-semibold"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
