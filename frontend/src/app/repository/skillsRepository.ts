import { skills } from '@/app/data/skillsData';
import { injectable } from 'tsyringe';

export interface ISkillsRepository {
  getSkills(): typeof skills;
}

@injectable()
export class SkillsRepository implements ISkillsRepository {
  getSkills() {
    return skills;
  }
}
