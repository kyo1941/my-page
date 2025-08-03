"use client";

import Image from 'next/image';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

export default function SkillsSection() {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  return (
    <div>
      <h2 className="text-3xl font-bold mb-8 text-gray-900">技術スタック</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        
        {skills.map((skill) => (
          <button
            key={skill.name}
            className="flex flex-col items-center py-2 bg-gray-50 rounded-lg shadow hover:-translate-y-0.5 hover:shadow-xl hover:bg-gray-100 transition-all duration-300"
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
      
      
      <AnimatePresence>
        {selectedSkill && (
          <motion.div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedSkill(null)}
            
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative"
              onClick={(e) => e.stopPropagation()}
              
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
                onClick={() => setSelectedSkill(null)}
              >
                ×
              </button>
              <div className="flex items-center mb-4">
                <Image
                  src={skills.find(s => s.name === selectedSkill)?.icon || ''}
                  alt={`${selectedSkill} icon`}
                  width={64}
                  height={64}
                  className="mr-4"
                />
                <h3 className="text-2xl font-bold text-gray-900">{selectedSkill}</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                {skills.find(s => s.name === selectedSkill)?.description}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
