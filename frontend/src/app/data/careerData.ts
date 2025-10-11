export type Career = {
  icon: string;
  company: string;
  period: string;
  position: string;
  tasks: string[];
  technologies: string[];
};

// 現在進行形の場合に使用する定数
export const CURRENT_TERM = '現在';

// ハードコードは将来的にやめるべき
export const careerData: Career[] = [
  {
    icon: '/icon/dwango-logo.svg',
    company: '株式会社ドワンゴ',
    period: '2025年11月 - 2026年1月',
    position: 'Androidエンジニア',
    tasks: [
      '動画配信アプリ「ニコニコ動画」のAndroidエンジニアとして従事。',
      '決まり次第追記します。',
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
      '既存のXMLベースのUIをJetpack Composeに置き換える作業を担当。\n触れたことのないアーキテクチャでありながら、短期間でキャッチアップしていきながら実装を行った。',
      'フルリモートワークであったため、より積極的にコミュニケーションをとり、進捗や課題を共有しながら開発を進めた。',
    ],
    technologies: [
      'Kotlin',
      'Jetpack Compose',
      'Flux',
      'Koin',
      'LiveData',
    ],
  },
  {
    icon: '/icon/sansan-logo.svg',
    company: 'Sansan株式会社',
    period: '2025年8月 - 2025年9月',
    position: 'Eight事業部 Androidエンジニア',
    tasks: [
      'toC名刺管理アプリ「Eight」チームのAndroidエンジニアとして従事。',
      'スクラム開発を通した、新機能開発における設計書の作成や実装。\nAndroidチームメンバーだけでなく、PdMとの仕様調整のコミュニケーションも行いつつ、初の実務経験ということもあり大規模なアーキテクチャについてキャッチアップしながら取り組んだ。',      
      'モーションセンサーを使用した名刺反転アニメーションを実装する新機能開発を担当。\nセンサーの制御を行い端末負荷を抑えつつ、ユーザー体験を向上させるアニメーションの実装を行った。',
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