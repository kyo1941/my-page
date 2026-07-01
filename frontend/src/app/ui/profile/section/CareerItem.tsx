"use client";

import { useState, useRef } from "react";
import { Career } from "@/app/data/careerData";
import ChevronIcon from "@/app/components/ChevronIcon";

type Props = Career & { isCurrent: boolean };

export default function CareerItem({
  company,
  url,
  isCurrent,
  period,
  position,
  tasks,
  technologies,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);

  const toggle = () => setIsOpen((prev) => !prev);

  return (
    <div ref={itemRef} className="ml-4">
      <button
        onClick={() =>
          itemRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          })
        }
        className="absolute flex w-3 h-3 bg-black rounded-full -left-1.5 ring-2 ring-white translate-y-10 cursor-pointer transition-all duration-200 hover:bg-white hover:ring-black"
      />

      {/* 内部の company リンクやタスク内リンクは stopPropagation して衝突を避ける */}
      <div
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        onClick={toggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggle();
          }
        }}
        className="group relative sky-tile ml-4 cursor-pointer px-6 pt-5 pb-6 transition-transform duration-200 hover:-translate-y-0.5"
      >
        <div className="flex items-center mb-2">
          <h3 className="text-2xl font-semibold text-gray-900">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="hover:text-blue-700 hover:underline"
            >
              {company}
            </a>
          </h3>
          {isCurrent && (
            <span className="bg-blue-100 text-blue-800 text-sm font-medium ml-3 px-2.5 py-0.5 rounded-full">
              Now
            </span>
          )}
        </div>
        <p className="block mb-5 text-sm font-normal leading-none text-gray-500">
          {period} | {position}
        </p>

        {isOpen ? (
          <div>
            <ul className="list-disc list-outside pl-5 text-gray-700">
              {tasks.map((task, taskIndex) => (
                <li key={taskIndex} className="mt-3 pl-1">
                  {task.content}
                  {task.details && task.details.length > 0 && (
                    <ul className="list-[circle] list-outside pl-5 mt-1 text-gray-700">
                      {task.details.map((sub, subIndex) => (
                        <li key={subIndex} className="mt-2 pl-1">
                          {sub.startsWith("https://") ||
                          sub.startsWith("http://") ? (
                            <a
                              href={sub}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-blue-600 hover:underline break-all"
                            >
                              {sub}
                            </a>
                          ) : (
                            sub
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
            {technologies.length > 0 && (
              <div className="mt-3.5 flex flex-wrap gap-2">
                {technologies.map((tech) => (
                  <span
                    key={tech}
                    className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-1 rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>
        ) : (
          tasks.length > 0 && (
            // まだ続きがあることを示すフェードアウトプレビュー
            <div className="max-h-12 overflow-hidden">
              <ul className="fade-preview list-disc list-outside pl-5 text-gray-700">
                <li className="pl-1">{tasks[0].content}</li>
              </ul>
            </div>
          )
        )}

        {/* ホバー/フォーカス時だけ見せる開閉ヒント。下向き=開く、上向き=閉じる */}
        <div className="pointer-events-none absolute inset-x-0 bottom-2 flex justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
          <ChevronIcon
            className={`h-5 w-5 text-sky-700/50 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </div>
      </div>
    </div>
  );
}
