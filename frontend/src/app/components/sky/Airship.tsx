import AirshipArt from "./airship.svg";

type AirshipProps = {
  hue: string;
};

/** 飛行船の見た目。airship.svg の currentColor に hue を流し込み、影を付ける。 */
export default function Airship({ hue }: AirshipProps) {
  return (
    <AirshipArt
      aria-hidden="true"
      style={{
        color: hue,
        filter: "drop-shadow(0 8px 11px rgba(30, 64, 120, 0.2))",
      }}
    />
  );
}
