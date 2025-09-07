export type Career = {
  icon: string;
  company: string;
  period: string;
  position: string;
  tasks: string[];
  technologies: string[];
};

// ハードコードは将来的にやめるべき
export const careerData: Career[] = [
  {
    icon: '/icon/dwango-logo.svg',
    company: '株式会社ドワンゴ',
    period: '2025年11月 - 2026年1月',
    position: 'Androidエンジニア',
    tasks: [
      '動画配信サイト「ニコニコ動画」のAndroidエンジニアとして従事。',
      '決まったらなんか書くよん',
    ],
    technologies: ['Kotlin', 'Jetpack'],
  },
  {
    icon: '/icon/company-icon.svg',
    company: '株式会社ミラティブ',
    period: '2025年10月 - 2025年10月',
    position: 'Androidエンジニア',
    tasks: [
      'ライブ配信アプリ「ミラティブ」のAndroidエンジニアとして従事。',
      '決まったらなんか書くよん',
    ],
    technologies: ['Kotlin', 'Jetpack'],
  },
  {
    icon: '/icon/sansan-logo.svg',
    company: 'Sansan株式会社',
    period: '2025年8月 - 2025年9月',
    position: 'Eight事業部 Androidエンジニア',
    tasks: [
      'toC名刺管理アプリ「Eight」チームのAndroidエンジニアとして従事。',
      'スクラム開発を通した、新機能開発における設計書の作成や実装。\nAndroidチームメンバーだけでなく、PdMとの仕様調整のコミュニケーションも行いつつ、初の実務経験ということもあり大規模なアーキテクチャについてキャッチアップしながら取り組んだ。',      
      'モーションセンサーを使用したアニメーションを実装する新機能開発を担当。',
    ],
    technologies: [
      'Kotlin',
      'GitHub', 
      'Jetpack Compose', 
      'MVVM', 
      'Dagger Hilt',
      'Kotlin Coroutines', 
      'Glide',
      'JUnit',
    ],
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