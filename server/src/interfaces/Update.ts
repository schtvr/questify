import Task from '../models/task';
import AchievementTemplate from '../models/achievementTemplate';
import Quest from '../models/quest';

export interface IUpdate {
  achievements: AchievementTemplate[]
  tasks: Task[]
  quests: Quest[]
  gainedExp: number
}

export const createUpdate = (): IUpdate => {
  return {
    achievements: [],
    tasks: [],
    quests: [],
    gainedExp: 0
  };
};