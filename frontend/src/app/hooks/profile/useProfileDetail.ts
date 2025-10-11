import { useMemo } from 'react';

export function useProfileDetail() {
  // 誕生日から年齢を計算
  const birthday = "2002-10-22";
  const age = useMemo(() => {
    const today = new Date();
    const birthDate = new Date(birthday);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }, []);

  // 静的プロフィール情報（将来的にRepository/API化も可能）
  const profile = {
    birthplace: '福島県 県北出身',
    birthday: '2002年10月22日',
    age,
    university: '埼玉大学大学院 理工学研究科 数理電子情報専攻 修士1年',
    description: [
      'Androidネイティブアプリ開発を主にやっています。最近はKotlin Multi Platformとかクロスプラットフォームにも興味を持っていたり。',
      'クライアント側だけでなく、バックエンドにも興味を持っているので、大学のうちに色々触っておきたいなあと思っている今日この頃。',
      'また、競技プログラミングにも取り組んでおりAtCoderに参加しています。弱々ですが楽しんでおります。大学のうちに水色いきたいな〜。',
      '趣味では、音楽鑑賞とか麻婆豆腐作りとかしてます。色々聴きますがフォークソングを聴いたり。老抽（ラオチョウ）や花椒（ホアジャオ）にもこだわって数年研究を重ねています。ぼちぼち美味しいのがつくれます。',
    ],
  };

  return { profile };
}
