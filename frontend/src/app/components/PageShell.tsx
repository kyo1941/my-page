import type { ReactNode } from "react";
import Header from "./header";

/**
 * 公開ページ共通の枠。
 * 背景の青空を地にして、その上に各ブロックを縦に並べるための
 * ヘッダーと余白リズムだけを提供する。コンテンツ自体の地は持たず、
 * 空が透ける余白でブロック間を区切る。
 */
export default function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen font-sans">
      <Header />
      <main
        id="main-content"
        className="max-w-4xl mx-auto px-4 pt-6 pb-28 space-y-14 sm:space-y-24"
      >
        {children}
      </main>
    </div>
  );
}
