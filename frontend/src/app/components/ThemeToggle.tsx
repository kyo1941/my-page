"use client";

import { FiMoon, FiSun } from "react-icons/fi";
import {
  CHOSEN_THEME_STORAGE_KEY,
  displayedTheme,
  type Theme,
} from "@/app/utils/chosenTheme";

export default function ThemeToggle() {
  const toggleTheme = () => {
    const next: Theme = displayedTheme() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      sessionStorage.setItem(CHOSEN_THEME_STORAGE_KEY, next);
    } catch {}
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="ライトとダークを切り替える"
      className="flex h-8 w-8 items-center justify-center text-gray-900 transition-opacity hover:opacity-70"
    >
      <FiMoon aria-hidden className="h-5 w-5 dark:hidden" />
      <FiSun aria-hidden className="hidden h-5 w-5 dark:block" />
    </button>
  );
}
