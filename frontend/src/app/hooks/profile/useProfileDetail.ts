import { useMemo } from "react";

export function useProfileDetail() {
  const birthday = "2002-10-22";
  const age = useMemo(() => {
    const today = new Date();
    const birthDate = new Date(birthday);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  }, []);

  const profile = {
    birthplace: "福島県 県北出身",
    birthday: "2002年10月22日",
    age,
    university: "埼玉大学大学院 理工学研究科 数理電子情報専攻 修士1年",
    description: [
      "Androidエンジニアをやっています。最近はKotlin Multi Platformに興味があったり、Kotlinでバックエンドを書いたりしています。",
      "趣味では、音楽鑑賞とか料理とかしてます。古い音楽が特に好きで、歌謡曲とかフォークソングとか聴いたりしています。オーディオとかもちょっと興味があったり。",
      "料理は、中華料理、特に麻婆豆腐が好きです。老抽（ラオチョウ）や花椒（ホアジャオ）にもこだわって数年研究を重ねています。ぼちぼち美味しいのがつくれます。",
    ],
  };

  return { profile };
}
