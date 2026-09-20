/** 背景の雲・飛行船の配置設定 */

export type CloudConfig = {
  top: string;
  scale: number;
  opacity: number;
  blur: number; // 遠景の霞み用の追加ぼかし
  seed: number; // 形のばらつき用
  duration: number;
};

export const clouds: CloudConfig[] = [
  { top: "6%", scale: 0.9, opacity: 0.85, blur: 2, seed: 7, duration: 520 },
  { top: "28%", scale: 0.55, opacity: 0.65, blur: 1, seed: 21, duration: 400 },
  { top: "45%", scale: 1.0, opacity: 0.8, blur: 4, seed: 4, duration: 700 },
  { top: "66%", scale: 0.65, opacity: 0.6, blur: 3, seed: 33, duration: 470 },
  { top: "84%", scale: 0.85, opacity: 0.6, blur: 6, seed: 15, duration: 640 },
];

/** 進行方向 (ltr=左→右, rtl=右→左) */
export const DIRECTIONS = ["ltr", "rtl"] as const;
export type Direction = (typeof DIRECTIONS)[number];

export type AirshipConfig = {
  top: string;
  scale: number;
  duration: number;
  delay: number;
  bobDuration: number;
  hue: string;
  dir: Direction;
};

export type StarConfig = {
  left: string;
  top: string;
  size: number;
  opacity: number;
  twinkleDuration: number;
  delay: number;
};

/**
 * 画面幅ごとの星の数。同じ数でも画面が狭いほど密に見えるため、広い画面から順に足していく。
 * 添字がそのまま表示する幅の段階になるよう、昇順で並べる。
 */
export const STAR_COUNTS = { narrow: 7, medium: 10, wide: 16 } as const;

/** 星の配置。サーバーとクライアントで同じ結果になる必要があるため、実行ごとに変わる乱数ではなく固定シードの擬似乱数から決める。*/
function seededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

function round(value: number, digits: number): number {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function shuffledRows(size: number, random: () => number): number[] {
  const rows = Array.from({ length: size }, (_, row) => row);
  for (let i = size - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [rows[i], rows[j]] = [rows[j], rows[i]];
  }
  return rows;
}

/**
 * 星は数が少ないので、素の乱数に任せると空の一角に寄ってしまう。
 * 幅の段階ごとに空を格子に区切り、1区画に1つずつ置いてから位置を揺らす。
 */
function buildStars(): StarConfig[] {
  const random = seededRandom(19411161);
  const additions = [
    STAR_COUNTS.narrow,
    STAR_COUNTS.medium - STAR_COUNTS.narrow,
    STAR_COUNTS.wide - STAR_COUNTS.medium,
  ];

  return additions.flatMap((size) => {
    const rows = shuffledRows(size, random);
    return Array.from({ length: size }, (_, column) => ({
      left: `${round(3 + ((column + random()) / size) * 94, 2)}%`,
      top: `${round(4 + ((rows[column] + random()) / size) * 80, 2)}%`,
      size: 1 + Math.round(random() * 2),
      opacity: round(0.45 + random() * 0.45, 2),
      twinkleDuration: round(4.2 + random() * 3.6, 2),
      delay: -round(random() * 7, 2),
    }));
  });
}

export const stars: StarConfig[] = buildStars();

export const airships: AirshipConfig[] = [
  {
    top: "13%",
    scale: 0.6,
    duration: 95,
    delay: -15, // 先に左から入ってくる
    bobDuration: 7,
    hue: "#d06054",
    dir: "ltr",
  },
  {
    top: "52%",
    scale: 0.4,
    duration: 135,
    delay: -5, // 赤よりやや遅れて右から現れる
    bobDuration: 9,
    hue: "#6b93d6",
    dir: "rtl",
  },
];
