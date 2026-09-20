import { stars } from "./skyConfig";

/** テーマ共通の空に、ダークモード時だけ控えめな星明かりを重ねる。 */
export default function StarField() {
  return (
    <div className="sky-stars absolute inset-0" aria-hidden="true">
      {stars.map((star) => (
        <span
          key={`${star.left}-${star.top}`}
          className={`sky-star ${star.crossed ? "sky-star-cross" : ""}`}
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            opacity: star.opacity,
            animationDuration: `${star.twinkleDuration}s`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
