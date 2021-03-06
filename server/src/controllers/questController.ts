import { Request, Response, Express } from 'express';
import Quest from '../models/quest';
import sendRes from '../funcs/sendRes';
import checkAchievements from '../funcs/checkAchievements';
import { createUpdate } from '../interfaces/Update';
import { Op } from 'sequelize';
import User from '../models/user';
const startQuest = async (req: Request, res: Response) => {
  if (!req.user) return sendRes(res, false, 400, 'Not authenticated');
  if (!req.params.questId) return sendRes(res, false, 422, 'Missing Form information');

  try {
    const questToStart = await Quest.findOne({
      where: {
        id: req.params.questId }
    });
    if (!questToStart) return sendRes(res, false, 422, 'Invalid quest Id');

    const isOnQuest = await req.user.getActiveQuests({
      where: {
        questId: req.params.questId
      }
    });
    if (isOnQuest.length !== 0) return sendRes(res, false, 403, 'Duplicate quest');

    const activeQuest = await req.user.createActiveQuest({
      questId: req.params.questId
    });

    if (!activeQuest) sendRes(res, false, 500, 'Error creating quest');

    return sendRes(res, true, 200, 'Quest started', activeQuest);

  } catch (err) {
    return sendRes(res, false, 500, 'Error starting quest', err);
  }
};

const completeQuest = async (req: Request, res: Response) => {
  const { user } = req;
  if (!user) return sendRes(res, false, 400, 'Not authenticated');

  if (!req.params.questId) return sendRes(res, false, 422, 'Missing form information');

  try {
    const questToComplete = await user.getActiveQuests({
      where: {
        questId: req.params.questId
      }
    });

    if (!questToComplete || questToComplete.length === 0)
      return sendRes(res, false, 422, 'Invalid quest Id');

    const template = await Quest.findOne({
      where: {
        id: questToComplete[0].questId
      }
    });
    if (!template) return sendRes(res, false, 422, 'Invalid quest Id');
    if (!await questToComplete[0].complete()) sendRes(res, false, 500, 'Server error completing quest');

    await user.update({
      exp: user.exp += template.completionExp
    });

    const update = createUpdate();
    update.gainedExp += template.completionExp;
    update.quests.push(template);
    await checkAchievements(user, 'Quests', update);

    return sendRes(res, true, 200, 'Quest completed', update);
  } catch (err) {
    return sendRes(res, false, 500, 'Server errored when completing quest.', err);
  }
};

const getUserActiveQuests = async (req: Request, res: Response) => {
  if (!req.user) return sendRes(res, false, 422, 'Not authenticated');
  try {
    const userQuests = await req.user.getActiveQuests();
    const questIds: number[] = [];
    for (const quest of userQuests) {
      questIds.push(quest.questId);
    }
    const questTemplates = await Quest.findAll({
      where: {
        id: {
          [Op.in]: questIds
        }
      }
    });
    return sendRes(res, true, 200, 'Retreived user\'s active quests', questTemplates);
  } catch (err) {
    return sendRes(res, false, 500, 'Error retrieving user\'s quests', err);
  }
};


const getCompletedQuests = async (req: Request, res: Response) => {
  if (!req.user) return sendRes(res, false, 422, 'Not authenticated');
  const user = req.user;
  try {
    const completedQuests = await user.getCompletedQuests();
    const questIds: number[] = [];
    for (const quest of completedQuests) {
      questIds.push(quest.questId);
    }
    const questTemplates = await Quest.findAll({
      where: {
        id: {
          [Op.in]: questIds
        }
      }
    });
    return sendRes(res, true, 200, 'Retrieved completed quests', questTemplates);
  } catch (err) {
    return sendRes(res, false, 500, 'Error retreiving completed quests', err);
  }
};

const getQuestTemplates = async (req: Request, res: Response) => {
  try {
    const allQuests = await Quest.findAll();
    return sendRes(res, true, 200, 'Retrieved quest templates', allQuests);
  } catch (err) {
    return sendRes(res, false, 500, 'Error retrieving quests', err);
  }
};

const getQuestTasks = async (req: Request, res: Response) => {
  const questId = req.params.questId;
  if (!questId) return sendRes(res, false, 422, 'Invalid form, please send questId');
  try {
    const template = await Quest.findOne({
      where: {
        id: questId
      }
    });
    if (!template) return sendRes(res, false, 500, 'Invalid questId: quest template does not exist') ;
    const tasks = await template.getTasks();
    return sendRes(res, true, 200, 'Retreived quest tasks', tasks);
  } catch (err) {
    return sendRes(res, false, 500, 'Error retrieving quest tasks', err);
  }
};

const getFriendsOnQuest = async (req: Request, res: Response) => {
  const user = req.user;
  const questId = req.params.questId;
  if (!user) return sendRes(res, false, 422, 'Not authenticated');
  if (questId === undefined) return sendRes(res, false, 403, 'Please provide a quest Id');

  try {
    const template = await Quest.findByPk(questId);
    if (!template) return sendRes(res, false, 403, 'No template found with that questId');

    const friends = await user.getFriends();
    const friendIds: number[] = [];
    friends.forEach(friend => {
      friendIds.push(friend.id);
    });

    const friendsOnQuest = await template.getActiveQuests({
      where: {
        userId: {
          [Op.in]: friendIds
        }
      }
    });

    return sendRes(res, true, 200, 'Friends on quest retrieved', friendsOnQuest);
  } catch (err) {
    return sendRes(res, false, 500, 'Server error getting friends on quest');
  }
};

const dropQuest = async (req: Request, res: Response) => {
  const user = req.user;
  const questId = req.params.questId;
  if (!user) return sendRes(res, false, 403, 'No valid user');
  if (!questId) return sendRes(res, false, 403, 'Please provide a valid questId');
  try {
    const numQuestId = parseInt(questId);
    if (typeof numQuestId !== 'number') return sendRes(res, false, 405, 'Send a number ya goon');
    user.removeActiveQuest(parseInt(questId));
  } catch (err) {
    return sendRes(res, false, 500, 'Server error dropping quest');
  }
};

const findCompletedQuestsById = async (req: Request, res: Response) => {
  const user = req.user;
  const userId = req.params.userId;
  if (!user || !userId) return sendRes(res, false, 403, 'Please provide a valid userId/user');
  try{
    const userToFind = User.findOne({
      where: {
        id: userId
      }
    })
    if (!userToFind) return sendRes(res, false, 404, 'Couldn\'t find a user with that id');
    const completedQuests = await user.getCompletedQuests();
    return sendRes(res, true, 200, 'Enjoy your completed quests!', completedQuests);
  }catch(err) {
    return sendRes(res, false, 500, 'Enjoy your error', err);
  }
}

const findActiveQuestsById = async (req: Request, res: Response) => {
  const user = req.user;
  const userId = req.params.userId;
  if (!user || !userId) return sendRes(res, false, 403, 'Please provide a valid userId/user');
  try{
    const userToFind = User.findOne({
      where: {
        id: userId
      }
    })
    if (!userToFind) return sendRes(res, false, 404, 'Couldn\'t find a user with that id');
    const activeQuests = await user.getActiveQuests();
    return sendRes(res, true, 200, 'Enjoy your active quests!', activeQuests);
  }catch(err) {
    return sendRes(res, false, 500, 'Enjoy your error', err);
  }
}




export default {
  startQuest,
  completeQuest,
  getUserActiveQuests,
  getQuestTemplates,
  getQuestTasks,
  getFriendsOnQuest,
  getCompletedQuests,
  dropQuest,
  findActiveQuestsById,
  findCompletedQuestsById
};
