export type Career = {
  company: string;
  url: string;
  period: string;
  position: string;
  tasks: string[];
  technologies: string[];
};

export const CURRENT_TERM = "現在";

export const careerData: Career[] = [
  {
    company: "株式会社MIXI",
    url: "https://mitene.us/",
    period: "2026年2月 - 2026年2月",
    position: "みてね - Androidエンジニア",
    tasks: [
      "子供の写真共有アプリ「みてね」のAndroidエンジニアとして1ヶ月従事。",
      "古いライブラリの更新に伴い、ADRの作成とPoCの実装による技術調査と選定を行った。",
      "その他、レガシーな技術のリプレイスも担当",
    ],
    technologies: ["Kotlin", "RxJava", "Kotlin Coroutines", "Dagger", "Hilt"],
  },
  {
    company: "株式会社ドワンゴ",
    url: "https://dwango.co.jp/",
    period: "2025年11月 - 2026年1月",
    position: "ニコニコ事業本部 - Androidエンジニア",
    tasks: [
      "動画アプリ「ニコニコ動画」のAndroidエンジニアとして3ヶ月従事。",
      "ショート動画実装の大規模案件のメンバーとしてアサインされ、画面の実装とAPI連携を担当。",
    ],
    technologies: ["Kotlin", "Jetpack Compose", "MVVM"],
  },
  {
    company: "株式会社ミラティブ",
    url: "https://mirrativ.co.jp/",
    period: "2025年10月 - 2025年10月",
    position: "技術部 - Androidエンジニア",
    tasks: [
      "ライブ配信アプリ「ミラティブ」のAndroidエンジニアとして1ヶ月従事。",
      "既存のXMLベースのUIをJetpack Composeに置き換える作業を担当。\n触れたことのないFluxアーキテクチャでありながら、短期間でキャッチアップしていきながら実装を行った。",
    ],
    technologies: ["Kotlin", "Jetpack Compose", "Flux", "Koin"],
  },
  {
    company: "Sansan株式会社",
    url: "https://jp.corp-sansan.com/",
    period: "2025年8月 - 2025年9月",
    position: "Eight Engineering Unit - Androidエンジニア",
    tasks: [
      "toC名刺管理アプリ「Eight」のAndroidエンジニアとして1ヶ月従事。",
      "スクラム開発を通した、新機能開発における設計書の作成や実装。\nAndroidチームメンバーだけでなく、PdMやデザイナーとの仕様・デザイン調整のコミュニケーションも行いつつ、初の実務経験ということもあり大規模なアーキテクチャについてキャッチアップしながら取り組んだ。",
      "モーションセンサーを使用した名刺反転アニメーションを実装する新機能開発を担当。\nセンサーの制御を行い端末負荷を抑えつつ、ユーザー体験を向上させるアニメーションの実装を行った。",
    ],
    technologies: [
      "Kotlin",
      "Jetpack Compose",
      "MVVM",
      "Dagger Hilt",
      "Glide",
      "JUnit",
    ],
  },
  {
    company: "埼玉大学",
    url: "https://www.saitama-u.ac.jp/",
    period: "2021年4月 - 2027年3月",
    position: "工学部 情報工学科 / 理工学研究科 数理電子情報専攻",
    tasks: [
      "半年間のiOSアプリチーム開発",
      "音声強調における教師なし学習環境下での少量データ学習に関する研究",
      "深層学習物体検知モデル(YOLO)を用いた衣服の汚れ検知と、精度向上のためのデータ拡張/補正アルゴリズムの設計・実装",
    ],
    technologies: [],
  },
];
