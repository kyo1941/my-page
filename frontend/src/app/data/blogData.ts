export type Blog = {
  slug: string; // ファイル名から自動で生成する
  title: string;
  date: string;
  description: string;
  coverImage: string | undefined;
  tags: string[];
  content: string;
};

// 仮の記事データなので今後読み込めるようにする必要があります
export function getBlogs(): Blog[] {
  return [
    {
      slug: "first-personal-site",
      title: "初めての個人サイト制作",
      date: "2025年5月17日",
      description: "個人サイトを作ることになった経緯とその過程で学んだことについてまとめました。",
      coverImage: "/images/blog/first-personal-site.jpg",
      tags: ["Web", "雑記"],
      content: "ここに記事の本文が入ります。"
    },
    {
      slug: "html-css-basics",
      title: "HTMLとCSSの基本",
      date: "2025年5月10日",
      description: "Webページの基本構造とスタイリングについて学んだことをまとめました。",
      coverImage: "/images/blog/html-css-basics.jpg",
      tags: ["Web", "技術"],
      content: "ここに記事の本文が入ります。"
    },
    {
      slug: "responsive-design",
      title: "レスポンシブデザインとは",
      date: "2025年5月3日",
      description: "様々な画面サイズに対応するWebサイトの作り方についてまとめました。",
      coverImage: "/images/blog/responsive-design.jpg",
      tags: ["Web", "デザイン"],
      content: "ここに記事の本文が入ります。"
    },
    {
      slug: "javascript-basics",
      title: "JavaScriptの基礎文法",
      date: "2025年4月28日",
      description: "JavaScriptの基本的な文法や使い方についてまとめました。",
      coverImage: "/images/blog/javascript-basics.jpg",
      tags: ["Web", "JavaScript"],
      content: "ここに記事の本文が入ります。"
    }
  ];
}
