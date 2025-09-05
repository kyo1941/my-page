"use client";

import { useMemo } from 'react';

export default function ProfileDetailSection() {
  const age = useMemo(() => {
    const birthday = "2002-10-22";
    const today = new Date();
    const birthDate = new Date(birthday);
    
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }, []);

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 text-gray-900">自己紹介</h1>
      <div className="prose max-w-none prose-lg">
        <ul className="text-gray-700 leading-relaxed mb-6">
            <li className="my-1">福島県 県北出身</li>
            <li className="my-1">2002年10月22日 生まれ（{age}歳）</li>
            <li className="my-1">埼玉大学大学院 理工学研究科 数理電子情報専攻 修士1年</li>
        </ul>

        <p>
          Androidネイティブアプリ開発を主にやっています。最近はKotlin Multi Platformとかクロスプラットフォームにも興味を持っていたり。
        </p>
        <p>
          クライアント側だけでなく、バックエンドにも興味を持っているので、大学のうちに色々触っておきたいなあと思っている今日この頃。
        </p>
        <p>
          また、競技プログラミングにも取り組んでおりAtCoderに参加しています。弱々ですが楽しんでおります。大学のうちに水色いきたいな〜。
        </p>
        <p className="my-6">
          趣味では、音楽鑑賞とか麻婆豆腐作りとかしてます。色々聴きますがフォークソングを聴いたり。老抽（ラオチョウ）や花椒（ホアジャオ）にもこだわって数年研究を重ねています。ぼちぼち美味しいのがつくれます。
        </p>
      </div>
    </div>
  );
}
