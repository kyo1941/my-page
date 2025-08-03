export type Career = {
  company: string;
  logoUrl?: string; // 会社のロゴ画像のURL（任意）
  period: string;
  position: string;
  tasks: string[];
  technologies: string[];
};

// 仮の経歴データなので読み込めるようにする必要がある
export const careerData: Career[] = [
  {
    company: '株式会社NextDev',
    period: '2022年4月 - 現在',
    position: 'フロントエンドエンジニア',
    tasks: [
      'BtoB向けSaaSプロダクトのUI設計・開発を担当',
      'Next.js (App Router) を用いたパフォーマンス改善と機能追加',
      'Storybookを導入し、コンポーネント駆動開発の文化を醸成',
      'E2Eテストの自動化により、デプロイプロセスの信頼性を向上',
    ],
    technologies: ['TypeScript', 'React', 'Next.js', 'Tailwind CSS', 'GraphQL', 'Vercel'],
  },
  {
    company: '合同会社WebApp Solutions',
    period: '2020年4月 - 2022年3月',
    position: 'Webエンジニア',
    tasks: [
      'ECサイトのバックエンド開発（PHP/Laravel）',
      'Vue.jsを用いた管理画面のフロントエンド改修',
      'AWS (EC2, RDS) を用いたインフラの構築・運用保守',
      '顧客との要件定義や仕様策定にも参加',
    ],
    technologies: ['PHP', 'Laravel', 'JavaScript', 'Vue.js', 'MySQL', 'AWS'],
  },
];