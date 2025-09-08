import { careerData, CURRENT_TERM } from '../../data/career';
import { parseDate } from '../../utils/parseDate';
import Image from 'next/image';
import { useMemo, useCallback } from 'react';

export default function CareerSection() {
  const now = useMemo(() => new Date(), []);

  const isCurrent = useCallback((period: string) => {
    const [startDateStr, endDateStr] = period.split(' - ');

    if (!startDateStr || !endDateStr) return false;

    const startDate = parseDate(startDateStr);
    if (isNaN(startDate.getTime())) return false;

    if (endDateStr === CURRENT_TERM) {
      return startDate <= now;
    }

    const endDate = parseDate(endDateStr);
    if (isNaN(endDate.getTime())) return false;

    if (startDate > endDate) return false;

    endDate.setMonth(endDate.getMonth() + 1);
    endDate.setDate(0);

    return startDate <= now && now <= endDate;
  }, [now]);

  // isCurrent関数を使って各キャリアが現在進行中かどうかを判定し、新しいプロパティを追加
  const processedCareerData = useMemo(() => {
    return careerData.map((career) => ({
      ...career,
      isCurrent: isCurrent(career.period)
    }));
  }, [now]);

  return (
    <div>
      <h2 className="text-3xl font-bold mb-10 text-gray-900">経歴</h2>
      <div className="m-6 relative border-l-2 border-gray-200">
        {processedCareerData.map((career, index) => (
          <div key={index} className="mb-10 ml-6">
            
            <span className="absolute flex items-center justify-center w-13 h-13 bg-white p-0.5 rounded-full -left-6.5 ring-2 ring-gray-100 shadow-[0_0_0_6px_white]">
              <Image
                src={career.icon}
                alt={`${career.company} icon`}
                width={64}
                height={64}
                className="object-contain rounded-full"
              />
            </span>

            <div className="ml-4 pt-2">
              <div className="flex items-center mb-3">
                <h3 className="text-2xl font-semibold text-gray-900">{career.company}</h3>
                {career.isCurrent && (
                    <span className="bg-blue-100 text-blue-800 text-sm font-medium ml-3 px-2.5 py-0.5 rounded-full">Now</span>
                )}
              </div>
              <p className="block my-3 text-sm font-normal leading-none text-gray-500">{career.period} | {career.position}</p>
              <ul className="list-disc list-outside text-gray-700 space-y-1.5">
                {career.tasks.map((task, taskIndex) => (
                  <li key={taskIndex} className='whitespace-pre-line'>{task}</li>
                ))}
              </ul>
              <div className="my-4 flex flex-wrap gap-2">
                {career.technologies.map((tech) => (
                  <span key={tech} className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-1 mb-3 rounded-full">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}