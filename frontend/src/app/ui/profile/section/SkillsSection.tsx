"use client";

import Image from "next/image";
import { useSkillsSection } from "@/app/hooks/profile/useSkillsSection";

export default function SkillsSection() {
  const { skills } = useSkillsSection();

  return (
    <div>
      <h2 className="text-3xl font-bold mb-8 text-gray-900">技術スタック</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map((skill) => (
          <div
            key={skill.name}
            className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm transition-shadow"
          >
            <div className="flex flex-col min-h-28">
              <div className="flex items-center gap-4">
                <div className="relative w-14 h-14 flex-shrink-0 rounded-lg p-2">
                  <Image
                    src={skill.icon}
                    alt={skill.name}
                    fill
                    className="object-contain p-1"
                  />
                </div>
                <h3 className="font-bold text-gray-900">{skill.name}</h3>
              </div>

              <p className="text-sm text-gray-600 mt-3 leading-snug whitespace-pre-wrap">
                {skill.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 注釈 */}
      <p className="text-xs text-gray-400 mt-6 leading-relaxed">
        Android ロボットは、Google
        が作成および提供している作品から複製または変更したものであり、{" "}
        <a
          href="https://creativecommons.org/licenses/by/3.0/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-gray-600"
        >
          クリエイティブ・コモンズ
        </a>
        表示 3.0 ライセンスに記載された条件に従って使用しています。
      </p>
    </div>
  );
}
