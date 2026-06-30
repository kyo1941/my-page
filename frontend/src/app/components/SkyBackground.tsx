"use client";

import React, { useEffect, useState } from "react";

/**
 * 青空に雲と飛行船がふわふわ流れる背景。
 * fixed で最背面に固定し、各ページのコンテンツはこの上にスクロールする。
 * 雲の初期横位置はマウント後に乱数で決めるため client component。
 * （サーバー側で乱数を使うと静的生成時に固定され、リロードしても変わらない）
 * prefers-reduced-motion 時はアニメーションを止め、要素は静止して表示される
 * （globals.css の `.sky-animated` ルールを参照）。
 */

type Cloud = {
  top: string;
  scale: number;
  opacity: number;
  blur: number; // 遠景の霞み用の追加ぼかし
  seed: number; // 形のばらつき用
  duration: number;
};

const clouds: Cloud[] = [
  { top: "6%", scale: 0.9, opacity: 0.85, blur: 2, seed: 7, duration: 520 },
  { top: "28%", scale: 0.55, opacity: 0.65, blur: 1, seed: 21, duration: 400 },
  { top: "45%", scale: 1.0, opacity: 0.8, blur: 4, seed: 4, duration: 700 },
  { top: "66%", scale: 0.65, opacity: 0.6, blur: 3, seed: 33, duration: 470 },
  { top: "84%", scale: 0.85, opacity: 0.6, blur: 6, seed: 15, duration: 640 },
];

type Airship = {
  top: string;
  scale: number;
  duration: number;
  delay: number;
  bobDuration: number;
  hue: string;
  dir: "ltr" | "rtl"; // 進行方向（ltr=左→右, rtl=右→左）
};

const airships: Airship[] = [
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

function CloudShape({
  opacity,
  blur,
  seed,
}: {
  opacity: number;
  blur: number;
  seed: number;
}) {
  // フラクタルノイズで楕円の集合を歪め、輪郭がもこもこした積雲らしい雲にする。
  // 上面は白、下面はわずかに青灰色にして立体感を出す。
  const fid = `cloud-f-${seed}`;
  const gid = `cloud-g-${seed}`;
  return (
    <div style={{ opacity, filter: blur ? `blur(${blur}px)` : undefined }}>
      <svg
        width="480"
        height="130"
        viewBox="0 0 480 130"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: "visible" }}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="0.66" stopColor="#ffffff" />
            <stop offset="1" stopColor="#dbe4f1" />
          </linearGradient>
          <filter id={fid} x="-25%" y="-25%" width="150%" height="150%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.012"
              numOctaves="4"
              seed={seed}
              stitchTiles="stitch"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="46"
              xChannelSelector="R"
              yChannelSelector="G"
            />
            <feGaussianBlur stdDeviation="2.5" />
          </filter>
        </defs>
        <g filter={`url(#${fid})`} fill={`url(#${gid})`}>
          <ellipse cx="240" cy="94" rx="220" ry="18" />
          <ellipse cx="210" cy="68" rx="120" ry="34" />
          <ellipse cx="96" cy="82" rx="86" ry="26" />
          <ellipse cx="372" cy="80" rx="100" ry="30" />
          <ellipse cx="270" cy="54" rx="72" ry="26" />
          <ellipse cx="140" cy="62" rx="80" ry="28" />
        </g>
      </svg>
    </div>
  );
}

function Airship({ hue }: { hue: string }) {
  // 機首を左に描く（呼び出し側で scaleX(-1) して進行方向＝右へ向ける）。
  // グラデーション/クリップ ID はインスタンスごとに衝突しないよう色から導出。
  const uid = hue.replace("#", "");
  const clipId = `env-clip-${uid}`;
  const hlId = `env-hl-${uid}`;
  const shId = `env-sh-${uid}`;
  // 両端を丸めた紡錘形の船体（先端付近の接線を縦にして丸いキャップにする）
  const envPath =
    "M14 47 C14 30 36 16 80 16 C120 16 152 24 166 47 C152 70 120 78 80 78 C36 78 14 64 14 47 Z";
  const seam = "#000000";
  return (
    <svg
      width="200"
      height="110"
      viewBox="0 0 200 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ filter: "drop-shadow(0 8px 11px rgba(30, 64, 120, 0.2))" }}
    >
      <defs>
        <clipPath id={clipId}>
          <path d={envPath} />
        </clipPath>
        {/* 上面の光沢 */}
        <linearGradient id={hlId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.6" />
          <stop offset="0.45" stopColor="#ffffff" stopOpacity="0.08" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        {/* 下面の陰り（立体感） */}
        <linearGradient id={shId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#000000" stopOpacity="0" />
          <stop offset="0.55" stopColor="#000000" stopOpacity="0" />
          <stop offset="1" stopColor="#000000" stopOpacity="0.32" />
        </linearGradient>
      </defs>

      {/* 尾翼（船体の後ろ＝右側）。上下の台形フィン。
          根元を船体後部の輪郭上に合わせ、尾部から生えて見えるようにする */}
      {/* 上（上底・下底を水平にした台形。前縁を斜め、後縁を垂直に。
          胴体後方75%付近に配置し、太い胴体に埋もれないよう上へ逃がして輪郭から突き出させる） */}
      <path d="M107 30 L127 6 L149 6 L149 30 Z" fill={hue} />
      <path d="M107 30 L127 6 L149 6 L149 30 Z" fill="rgba(0,0,0,0.18)" />
      {/* 下 */}
      <path d="M107 64 L127 88 L149 88 L149 64 Z" fill={hue} />
      <path d="M107 64 L127 88 L149 88 L149 64 Z" fill="rgba(0,0,0,0.24)" />

      {/* 船体 */}
      <path d={envPath} fill={hue} />

      {/* 陰影・継ぎ目（船体内にクリップ） */}
      <g clipPath={`url(#${clipId})`}>
        <rect width="200" height="110" fill={`url(#${hlId})`} />
        <rect width="200" height="110" fill={`url(#${shId})`} />
        {/* 円周方向のパネルライン */}
        <path
          d="M58 16 C52 30 52 64 58 78"
          stroke={seam}
          strokeOpacity="0.12"
          strokeWidth="1.1"
          fill="none"
        />
        <path
          d="M95 15 C90 30 90 64 95 79"
          stroke={seam}
          strokeOpacity="0.12"
          strokeWidth="1.1"
          fill="none"
        />
        <path
          d="M132 17 C128 31 128 63 132 77"
          stroke={seam}
          strokeOpacity="0.12"
          strokeWidth="1.1"
          fill="none"
        />
        {/* 機首の補強キャップ */}
        <path d="M14 47 C27 33 27 61 14 47 Z" fill="rgba(0,0,0,0.1)" />
        {/* 中心線 */}
        <path
          d="M18 47 L162 47"
          stroke="#ffffff"
          strokeOpacity="0.16"
          strokeWidth="1"
          fill="none"
        />
      </g>

      {/* 係留先端 */}
      <circle cx="14" cy="47" r="2.3" fill="rgba(0,0,0,0.32)" />

      {/* 吊り索 */}
      <line x1="73" y1="76" x2="76" y2="82" stroke="#39414f" strokeWidth="1" />
      <line x1="97" y1="77" x2="94" y2="82" stroke="#39414f" strokeWidth="1" />

      {/* ゴンドラ（客室） */}
      <rect x="69" y="80" width="33" height="11" rx="5" fill="#39414f" />
      <rect
        x="69"
        y="80"
        width="33"
        height="4"
        rx="2"
        fill="rgba(0,0,0,0.25)"
      />
      {/* 窓 */}
      <rect x="74" y="84.5" width="4" height="3.5" rx="1.2" fill="#bcd6f0" />
      <rect x="81" y="84.5" width="4" height="3.5" rx="1.2" fill="#bcd6f0" />
      <rect x="88" y="84.5" width="4" height="3.5" rx="1.2" fill="#bcd6f0" />
      <rect x="95" y="84.5" width="4" height="3.5" rx="1.2" fill="#bcd6f0" />
    </svg>
  );
}

export default function SkyBackground() {
  // 雲の初期横位置をリロードごとにランダム化する。
  // マウント後に乱数を確定し、その時点で初めて雲を描画することで、
  // SSR とクライアント初回描画の不一致（hydration mismatch）を避ける。
  // 負の delay でドリフト周期の途中から再生＝ランダムな横位置から開始。
  const [cloudDelays, setCloudDelays] = useState<number[] | null>(null);
  useEffect(() => {
    setCloudDelays(clouds.map((c) => -Math.random() * c.duration));
  }, []);

  return (
    <div
      className="sky-animated pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      aria-hidden="true"
    >
      {/* 空のグラデーション */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-400 via-sky-200 to-sky-50" />

      {/* 太陽のやわらかい光 */}
      <div className="absolute -right-16 -top-16 h-72 w-72 rounded-full bg-white/50 blur-3xl" />
      <div className="absolute right-6 top-6 h-28 w-28 rounded-full bg-yellow-100/80 blur-2xl" />

      {/* 雲（delay 確定後＝マウント後にのみ描画。負の delay で開始位置をランダムに） */}
      {cloudDelays &&
        clouds.map((cloud, i) => (
          <div
            key={`cloud-${i}`}
            className="sky-drift absolute left-0"
            style={{
              top: cloud.top,
              transform: "translateX(40vw)",
              animationDuration: `${cloud.duration}s`,
              animationDelay: `${cloudDelays[i]}s`,
              willChange: "transform",
            }}
          >
            {/* scale はアニメーションに踏まれないよう静止ラッパーに分離 */}
            <div style={{ transform: `scale(${cloud.scale})` }}>
              <CloudShape
                opacity={cloud.opacity}
                blur={cloud.blur}
                seed={cloud.seed}
              />
            </div>
          </div>
        ))}

      {/* 飛行船 */}
      {airships.map((ship, i) => (
        <div
          key={`ship-${i}`}
          className="sky-fly absolute left-0"
          style={{
            top: ship.top,
            transform: "translateX(60vw)",
            animationDuration: `${ship.duration}s`,
            animationDelay: `${ship.delay}s`,
            // rtl は再生方向を逆にして右→左へ進める
            animationDirection: ship.dir === "rtl" ? "reverse" : undefined,
            willChange: "transform",
          }}
        >
          {/* bob は scale の外側に置き、上下動を画面ピクセル基準（縮小されない）にする。
              ltr のときだけ scaleX(-1) で機首を右へ向ける（rtl は元の左向きのまま） */}
          <div
            className="sky-bob"
            style={{
              animationDuration: `${ship.bobDuration}s`,
              animationDelay: `${i * -3}s`,
              willChange: "transform",
            }}
          >
            <div
              style={{
                transform: `scale(${ship.scale})${ship.dir === "ltr" ? " scaleX(-1)" : ""}`,
              }}
            >
              <Airship hue={ship.hue} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
