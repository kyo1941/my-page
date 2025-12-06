import { skills } from "@/app/data/skillsData";

export class SkillsRepository {
  getSkills() {
    return skills;
  }
}

export const skillsRepository = new SkillsRepository();
