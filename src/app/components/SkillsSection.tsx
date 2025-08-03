import Image from 'next/image';

export default function SkillsSection() {
  const skills = [
    { name: 'TypeScript', icon: '/icon/typescript.svg' },
    { name: 'React', icon: '/icon/react-2.svg' },
    { name: 'Python', icon: '/icon/python-5.svg' },
    { name: 'C++', icon: '/icon/c++.svg' },
    { name: 'Kotlin', icon: '/icon/kotlin-1.svg' },
    { name: 'HTML', icon: '/icon/html-1.svg' },
    { name: 'CSS', icon: '/icon/css-3.svg' },
    { name: 'Tailwind CSS', icon: '/icon/tailwind-css-2.svg' },
    { name: 'Jetpack', icon: '/icon/jetpack-compose.svg' },
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold mb-8 text-gray-900">技術スタック</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        {skills.map((skill) => (
          <div key={skill.name} className="flex flex-col items-center py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <Image
              src={skill.icon}
              alt={`${skill.name} icon`}
              width={48}
              height={48}
              className="mb-2"
            />
            <span className="text-sm font-medium text-gray-700">{skill.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
