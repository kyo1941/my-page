import type { ReactNode } from "react";
import Header from "./header";

/**
 * 公開ページ共通の枠。
 * 画面全体の縦サイズ確保 + ヘッダー + 中央寄せの frosted glass カードを提供し、
 * 背景の青空（SkyBackground）が透けて見えるようにする。
 */
export default function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen font-sans">
      <Header />
      <main id="main-content" className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl ring-1 ring-white/40 p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
