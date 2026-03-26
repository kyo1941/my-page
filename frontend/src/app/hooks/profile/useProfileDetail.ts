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
      "Androidエンジニアをやっています。最近はKotlin Multi Platformに興味があったり、Kotlinでバックエンドを書いたりもしています。",
      "趣味では、音楽鑑賞とか料理とかしてます。古い音楽が特に好きで、昭和歌謡とかフォークソングとか特に聴いたりしています。オーディオとかも興味があったりレコードを少々持っていたりします。",
      "料理は、中華料理、特に麻婆豆腐が好きです。老抽（ラオチョウ）や花椒（ホアジャオ）にもこだわって数年作っています。ぼちぼち美味しいのがつくれます。",
      "最近は仏教の勉強もしており、宗教というよりも哲学的な側面に興味があります。怪しい者ではございません。座右の銘は「色即是空 空即是色」です。",
    ],
  };

  return { profile };
}
