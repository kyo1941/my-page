import { useState } from 'react';
import { container } from 'tsyringe';
import { ISkillsRepository } from '@/app/repository/skillsRepository';

export function useSkillsSection() {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const skillsRepository = container.resolve<ISkillsRepository>('ISkillsRepository');
  const skills = skillsRepository.getSkills();
  return {
    skills,
    selectedSkill,
    setSelectedSkill,
  };
}
