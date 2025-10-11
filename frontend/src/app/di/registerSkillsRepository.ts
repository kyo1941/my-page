import { container } from 'tsyringe';
import { SkillsRepository } from '@/app/repository/skillsRepository';

container.register('ISkillsRepository', { useClass: SkillsRepository });
