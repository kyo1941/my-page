import { useId } from "react";
import { cloudEllipses } from "./skyGeometry";

type CloudShapeProps = {
  opacity: number;
  blur: number;
  seed: number;
};

/**
 * 楕円集合を土台に、フラクタルノイズで輪郭を歪めてもこもこした積雲らしい雲を作る。
 * 配色は空のテーマ変数から受け取り、形状と動きは昼夜で共有する。
 * seed で形のばらつきと衝突回避 ID を決める。
 */
export default function CloudShape({ opacity, blur, seed }: CloudShapeProps) {
  // フィルタ/グラデーション ID はインスタンス間で衝突しないよう useId から導出する
  const uid = useId();
  const fid = `cloud-f-${uid}`;
  const gid = `cloud-g-${uid}`;
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
            <stop offset="0" stopColor="var(--sky-cloud-highlight)" />
            <stop offset="0.66" stopColor="var(--sky-cloud-body)" />
            <stop offset="1" stopColor="var(--sky-cloud-shadow)" />
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
          {cloudEllipses.map((e) => (
            <ellipse
              key={`${e.cx}-${e.cy}`}
              cx={e.cx}
              cy={e.cy}
              rx={e.rx}
              ry={e.ry}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
