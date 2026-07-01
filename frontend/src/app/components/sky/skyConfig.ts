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
