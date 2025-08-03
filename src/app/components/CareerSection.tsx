import { careerData } from '../data/career';

export default function CareerSection() {
  return (
    <div className='items-center'>
      <h2 className="text-3xl font-bold mb-10 text-gray-900">経歴</h2>
      <div className="m-6 relative border-l-2 border-gray-200">
        {careerData.map((career, index) => (
          <div key={index} className="mb-10 ml-6">
            {/* タイムラインの丸い点 */}
            <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white">
              <svg className="w-2.5 h-2.5 text-blue-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4Z"/>
              </svg>
            </span>

            <div className="ml-4">
              <h3 className="text-2xl font-semibold text-gray-900">{career.company}</h3>
              <p className="block my-3 text-sm font-normal leading-none text-gray-500">{career.period} | {career.position}</p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
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