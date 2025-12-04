import { useState } from 'react';
import { skillsRepository } from '@/app/repository/skillsRepository';

export function useSkillsSection() {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const skills = skillsRepository.getSkills();
  return {
    skills,
    selectedSkill,
    setSelectedSkill,
  };
}
