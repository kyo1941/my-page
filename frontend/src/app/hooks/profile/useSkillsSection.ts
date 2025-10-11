import { useState } from 'react';
import { getSkills } from '@/app/repository/skillsRepository';

export function useSkillsSection() {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const skills = getSkills();
  return {
    skills,
    selectedSkill,
    setSelectedSkill,
  };
}
