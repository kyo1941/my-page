import AirshipArt from "./airship.svg";

type AirshipProps = {
  hue: string;
};

/** 飛行船の見た目。船体色は個体ごとに変え、影と灯りはテーマ側で切り替える。 */
export default function Airship({ hue }: AirshipProps) {
  return (
    <AirshipArt
      className="airship-art"
      aria-hidden="true"
      style={{
        color: hue,
      }}
    />
  );
}
