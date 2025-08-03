"use client";

import Image from 'next/image';
import { useState } from 'react';

export default function SkillsSection() {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  const skills = [
    { name: 'Kotlin', icon: '/icon/kotlin-1.svg', description: 'Android開発の標準装備ですので、それなりには使えます。' },
    { name: 'Jetpack Compose', icon: '/icon/jetpack-compose.svg', description: 'これなしではもうやっていけません。あとJetpackライブラリも色々使えます。' },
    { name: 'HTML', icon: '/icon/html-1.svg', description: 'WEB開発では避けては通れないので勉強中です。' },
    { name: 'CSS', icon: '/icon/css-3.svg', description: 'デザインが整うと一気に垢抜けるので楽しいです。こちらも勉強中です。' },
    { name: 'Tailwind CSS', icon: '/icon/tailwind-css-2.svg', description: 'コンポーネントごとにCSS書けるのが便利すぎて感動してます。積極的に使いがちです。' },
    { name: 'TypeScript', icon: '/icon/typescript.svg', description: 'フロントエンドもバックエンドにも使えるので興味津々です。勉強中です。' },
    { name: 'React', icon: '/icon/react-2.svg', description: 'Vue.jsもあるみたいだけど、Composeっぽいのはこっちなのかなあと思っている。' },
    { name: 'Next.js', icon: '/icon/next-js.svg', description: 'このWEBサイトにもNext.jsを使用しています。' },
    { name: 'Python', icon: '/icon/python-5.svg', description: '深層学習系の研究で使用しています。' },
    { name: 'C++', icon: '/icon/c++.svg', description: '競技プログラミングに使っています。もはやそれ専用の言語と化しています。' },
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold mb-8 text-gray-900">技術スタック</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        {skills.map((skill) => (
          <button
            key={skill.name}
            className="flex flex-col items-center py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => setSelectedSkill(selectedSkill === skill.name ? null : skill.name)}
          >
            <Image
              src={skill.icon}
              alt={`${skill.name} icon`}
              width={48}
              height={48}
              className="mb-2"
            />
            <span className="text-sm font-medium text-gray-700">{skill.name}</span>
          </button>
        ))}
      </div>
      
      {selectedSkill && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{selectedSkill}</h3>
          <p className="text-gray-700">
            {skills.find(s => s.name === selectedSkill)?.description}
          </p>
        </div>
      )}
    </div>
  );
}
