import { careerData } from '../../data/career';
import Image from 'next/image';

export default function CareerSection() {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-10 text-gray-900">経歴</h2>
      <div className="m-6 relative border-l-2 border-gray-200">
        {careerData.map((career, index) => (
          <div key={index} className="mb-10 ml-6">
            
            <span className="absolute flex items-center justify-center w-13 h-13 bg-white p-0.5 rounded-full -left-7 ring-2 ring-gray-100">
              <Image
                src={career.icon}
                alt={`${career.company} icon`}
                width={64}
                height={64}
                className="object-contain rounded-full"
              />
            </span>

            <div className="ml-4 pt-2">
              <h3 className="text-2xl font-semibold text-gray-900">{career.company}</h3>
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