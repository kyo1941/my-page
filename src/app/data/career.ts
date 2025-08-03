export type Career = {
  icon: string;
  company: string;
  logoUrl?: string; // 会社のロゴ画像のURL（任意）
  period: string;
  position: string;
  tasks: string[];
  technologies: string[];
};

// ハードコードは将来的にやめるべき
export const careerData: Career[] = [
  {
    icon: '/icon/company-icon.svg',
    company: 'Sansan株式会社',
    period: '2025年8月 - 現在',
    position: 'Androidエンジニア',
    tasks: [
      'toC名刺管理アプリ「Eight」チーム',
      '詳しくは決まり次第記述する',      
    ],
    technologies: ['Kotlin', 'Jetpack'],
  },
  {
    icon: '/icon/saitama-univ.png',
    company: '埼玉大学',
    period: '2021年4月 - 2027年3月',
    position: '工学部 情報工学科 / 理工学研究科 数理電子情報専攻',
    tasks: [
      '半年間のiOSアプリチーム開発',
      '音声強調における教師なし学習環境下での少量データ学習に関する研究',
      '深層学習物体検知モデル(YOLO)を用いた衣服の汚れ検知と、精度向上のためのデータ拡張/補正アルゴリズムの設計・実装',
    ],
    technologies: [],
  },
];