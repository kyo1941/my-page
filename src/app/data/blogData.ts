export type Blog = {
  title: string;
  date: string;
  description: string;
  url: string;
};

// 仮の記事データなので今後読み込めるようにする必要があります
export function getBlogs(): Blog[] {
  return [
    {
        title: "初めての個人サイト制作",
        date: "2025年5月17日",
        description: "個人サイトを作ることになった経緯とその過程で学んだことについて…",
        url: "#1"
      },
      {
        title: "HTMLとCSSの基本",
        date: "2025年5月10日",
        description: "Webページの基本構造とスタイリングについて学んだことをまとめました…",
        url: "#2"
      },
      {
        title: "レスポンシブデザインとは",
        date: "2025年5月3日",
        description: "様々な画面サイズに対応するWebサイトの作り方について…",
        url: "#3"
      },
      {
        title: "JavaScriptの基礎文法",
        date: "2025年4月28日",
        description: "JavaScriptの基本的な文法や使い方について解説します…",
        url: "#4"
      }
  ];
}
