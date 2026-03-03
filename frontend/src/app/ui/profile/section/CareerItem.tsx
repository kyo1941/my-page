"use client";

import { useState } from "react";
import Image from "next/image";
import { DEFAULT_COMPANY_ICON } from "@/app/data/careerData";
import { Career } from "@/app/data/careerData";

type Props = Career & { isCurrent: boolean };

export default function CareerItem({
  icon,
  company,
  isCurrent,
  period,
  position,
  tasks,
  technologies,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleButton = (open: boolean) => (
    <button
      onClick={() => setIsOpen(open)}
      className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-800 mb-2 cursor-pointer"
    >
      {open ? "詳細を見る ▼" : "閉じる ▲"}
    </button>
  );

  return (
    <div className="mb-10 ml-6">
      <span className="absolute flex items-center justify-center w-13 h-13 bg-white p-0.5 rounded-full -left-6.5 ring-2 ring-gray-100 shadow-[0_0_0_6px_white]">
        <Image
          src={icon ?? DEFAULT_COMPANY_ICON}
          alt={`${company} icon`}
          width={64}
          height={64}
          className="object-contain rounded-full"
        />
      </span>

      <div className="ml-4 pt-2">
        <div className="flex items-center mb-2">
          <h3 className="text-2xl font-semibold text-gray-900">{company}</h3>
          {isCurrent && (
            <span className="bg-blue-100 text-blue-800 text-sm font-medium ml-3 px-2.5 py-0.5 rounded-full">
              Now
            </span>
          )}
        </div>
        <p className="block mb-4 text-sm font-normal leading-none text-gray-500">
          {period} | {position}
        </p>

        {!isOpen && toggleButton(true)}

        {isOpen && (
          <>
            <ul className="list-disc list-outside text-gray-700 space-y-1.5">
              {tasks.map((task, taskIndex) => (
                <li key={taskIndex} className="whitespace-pre-line my-3">
                  {task}
                </li>
              ))}
            </ul>
            <div className="my-4 flex flex-wrap gap-2">
              {technologies.map((tech) => (
                <span
                  key={tech}
                  className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-1 rounded-full"
                >
                  {tech}
                </span>
              ))}
            </div>
            {toggleButton(false)}
          </>
        )}
      </div>
    </div>
  );
}
