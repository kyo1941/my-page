export type Theme = "light" | "dark";

export const CHOSEN_THEME_STORAGE_KEY = "chosen-theme";

export const restoreChosenThemeScript = `(() => {
  try {
    if (location.pathname.startsWith("/admin")) return;
    const theme = sessionStorage.getItem(${JSON.stringify(CHOSEN_THEME_STORAGE_KEY)});
    if (theme === "light" || theme === "dark") {
      document.documentElement.dataset.theme = theme;
    }
  } catch {}
})();`;
