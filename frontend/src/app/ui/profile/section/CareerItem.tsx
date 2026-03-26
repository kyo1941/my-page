"use client";

import { useState, useRef } from "react";
import { Career } from "@/app/data/careerData";

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

  const toggleButton = (isOpened: boolean) => (
    <button
      onClick={() => setIsOpen(!isOpened)}
      className={`flex items-center gap-1 text-sm text-gray-600 px-2.5 py-1 mb-2 cursor-pointer hover:bg-gray-100 hover:rounded-full ${isOpened ? " mt-5" : ""}`}
    >
      {isOpened ? "閉じる ▲" : "詳細を見る ▼"}
    </button>
  );

  return (
    <div
      ref={itemRef}
      className={`mb-10 ml-4 pl-1 border-l-2 rounded-l-xl ${isOpen ? "border-gray-300" : "border-gray-200"}`}
    >
      <button
        onClick={() =>
          itemRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          })
        }
        className="absolute flex w-3 h-3 bg-black rounded-full -left-1.5 ring-2 ring-white translate-y-4 cursor-pointer transition-all duration-200 hover:bg-white hover:ring-black"
      />

      <div className="ml-4 pt-2">
        <div className="flex items-center mb-2">
          <h3 className="text-2xl font-semibold text-gray-900">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
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
        <p className="block mb-4 text-sm font-normal leading-none text-gray-500">
          {period} | {position}
        </p>

        {!isOpen && toggleButton(false)}

        <div className={isOpen ? "" : "hidden"}>
          <ul className="list-disc list-outside pl-5 text-gray-700">
            {tasks.map((task, taskIndex) => (
              <li key={taskIndex} className="mt-3 pl-1">
                {task.content}
                {task.details && task.details.length > 0 && (
                  <ul className="list-[circle] list-outside pl-5 mt-1 text-gray-700">
                    {task.details.map((sub, subIndex) => (
                      <li key={subIndex} className="mt-2 pl-1">
                        {sub}
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
          {toggleButton(true)}
        </div>
      </div>
    </div>
  );
}
