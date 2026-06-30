"use client";

import { useEffect, useState } from "react";
import { airships, clouds, type Direction } from "./skyConfig";
import CloudShape from "./CloudShape";
import Airship from "./Airship";

const animationDirectionByDir: Record<Direction, "normal" | "reverse"> = {
  ltr: "normal",
  rtl: "reverse",
};

const flipByDir: Record<Direction, string> = {
  ltr: "scaleX(-1)",
  rtl: "scaleX(1)",
};

/** 青空に雲と飛行船がふわふわ流れる、最背面に固定する背景。 */
export default function SkyBackground() {
  // 雲の初期横位置をリロードごとに散らす。乱数はマウント後に確定して
  // hydration mismatch を避け、負の delay でドリフト周期の途中から再生する。
  const [cloudDelays, setCloudDelays] = useState<number[] | null>(null);
  useEffect(() => {
    setCloudDelays(clouds.map((c) => -Math.random() * c.duration));
  }, []);

  return (
    <div
      className="sky-animated pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-sky-400 via-sky-200 to-sky-50" />
      <div className="absolute -right-16 -top-16 h-72 w-72 rounded-full bg-white/50 blur-3xl" />
      <div className="absolute right-6 top-6 h-28 w-28 rounded-full bg-yellow-100/80 blur-2xl" />

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
            {/* scale はアニメーションの transform に踏まれないよう静止ラッパーへ分離 */}
            <div style={{ transform: `scale(${cloud.scale})` }}>
              <CloudShape
                opacity={cloud.opacity}
                blur={cloud.blur}
                seed={cloud.seed}
              />
            </div>
          </div>
        ))}

      {airships.map((ship, i) => (
        <div
          key={`ship-${i}`}
          className="sky-fly absolute left-0"
          style={{
            top: ship.top,
            transform: "translateX(60vw)",
            animationDuration: `${ship.duration}s`,
            animationDelay: `${ship.delay}s`,
            animationDirection: animationDirectionByDir[ship.dir],
            willChange: "transform",
          }}
        >
          {/* bob は scale の外側に置き、上下動を画面ピクセル基準にする（scale で縮まない） */}
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
                transform: `scale(${ship.scale}) ${flipByDir[ship.dir]}`,
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
