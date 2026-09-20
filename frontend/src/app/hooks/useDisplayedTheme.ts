import { useSyncExternalStore } from "react";
import { displayedTheme, type Theme } from "@/app/utils/chosenTheme";

function subscribe(onChange: () => void) {
  const osSetting = window.matchMedia("(prefers-color-scheme: dark)");
  osSetting.addEventListener("change", onChange);
  const choice = new MutationObserver(onChange);
  choice.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => {
    osSetting.removeEventListener("change", onChange);
    choice.disconnect();
  };
}

export function useDisplayedTheme(): Theme | undefined {
  return useSyncExternalStore(subscribe, displayedTheme, () => undefined);
}
