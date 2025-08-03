import { careerData } from '../../data/career';
import Image from 'next/image';

export default function CareerSection() {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-10 text-gray-900">経歴</h2>
      <div className="m-6 relative border-l-2 border-gray-200">
        {careerData.map((career, index) => (
          <div key={index} className="mb-10 ml-6">
            
            <span className="absolute flex items-center justify-center w-12 h-12 bg-gray-50 p-1 rounded-full -left-6 ring-2 ring-white">
              <Image
                src={career.icon}
                alt={`${career.company} icon`}
                width={48}
                height={48}
                className="object-contain rounded-full"
              />
            </span>

            <div className="ml-4 pt-2">
              <h3 className="text-2xl font-semibold text-gray-900">{career.company}</h3>
              <p className="block my-3 text-sm font-normal leading-none text-gray-500">{career.period} | {career.position}</p>
              <ul className="list-disc list-inside text-gray-700 space-y-1.5">
                {career.tasks.map((task, taskIndex) => (
                  <li key={taskIndex}>{task}</li>
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