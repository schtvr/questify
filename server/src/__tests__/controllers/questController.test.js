import express from 'express';
import supertest from 'supertest';
import sequelize from '../../models/index';
import bcrypt from 'bcrypt';
import 'regenerator-runtime/runtime';
import User from '../../models/user';
import router from '../../router';
import dbInit from '../../models/init';
import Quest from '../../models/quest';
import ActiveQuest from '../../models/activeQuest';

describe('Quest Controller', () => {
  const app = express();
  app.use(express.json());
  app.use(router);
  
  const request = supertest(app);

  let user;
  let quest;
  let loginRes;
  beforeAll(async () => {
    await dbInit();
    user = await User.create({
      firstName: 'BobisCringe',
      lastName: 'FuckoDasdds',
      userName: 'fuckoBadssadadadsob',
      password: bcrypt.hashSync('bigshitasdasdadster123', 10),
      email: 'fuckoBobadsdasd123@fuckbob.com'
    });
    quest = await Quest.create({
      duration: 100,
      name: 'best quest ever',
      description: 'fuck bob once per day for 100 days',
      category: 'bob',
      completionExp: 10,
    });
    loginRes = await request.post('/login').send({
      emailOrUserName: 'fuckoBadssadadadsob',
      password: 'bigshitasdasdadster123'
    }); 
  });
  afterAll(async () => {
    await User.destroy({
      where: {}
    });
    await Quest.destroy({
      where: {}
    });
    await sequelize.drop();
  });
  test('Should be able to join a created quest', async () => { 
    const res = await request.post(`/quest/start/${quest.id}`).set(
      'Authorization',
      `Bearer ${loginRes.body.data}`
    );
    expect(res.body.status).toBe('Okay');
    expect(res.body.message).toBe('Quest started');
  });
  test('Should\'nt be able to joined a non-created quest', async () => {
    const res = await request.post('/quest/start/15151').set(
      'Authorization',
      `Bearer ${loginRes.body.data}`
    );
    expect(res.body.status).toBe('Bad');
    expect(res.body.message).toBe('Invalid quest Id');
    
  });

  test('Quest should appear as one of the user\'s active quests', async () => {
    await request.post('/quest/getActiveQuests').set(
      'Authorization',
      `Bearer ${loginRes.body.data}`
    );
    await request.post(`/quest/start/${quest.id}`).set(
      'Authorization',
      `Bearer ${loginRes.body.data}`
    );
    const res2 = await request.get('/quest/getActiveQuests').set(
      'Authorization',
      `Bearer ${loginRes.body.data}`
    );
    expect(res2.body.data).toHaveLength(1);
  });

  test('Shouldn\'t be able to join a quest twice', async () => {
    const res = await request.post(`/quest/start/${quest.id}`).set(
      'Authorization',
      `Bearer ${loginRes.body.data}`
    );
    expect(res.body.status).toBe('Bad');
    expect(res.body.message).toBe('Duplicate quest');
  });
  
  test('should complete quests', async () => {
    const res = await request.post(`/quest/complete/${quest.id}`).set(
      'Authorization',
      `Bearer ${loginRes.body.data}`
    );
    const userCompleted = await User.findOne({
      where: {
        id: user.id
      }
    });
    expect(userCompleted.exp).toBe(10);
      
    const activeQuests = await userCompleted.getActiveQuests();
    const completedQuests = await userCompleted.getCompletedQuests();
    expect(activeQuests).toHaveLength(0);
    expect(completedQuests).toHaveLength(1);
    expect(res.body.status).toBe('Okay');
  });
  
  test('only complete quests once', async () => {
    const res = await request.post(`/quest/complete/${quest.id}`).set(
      'Authorization',
      `Bearer ${loginRes.body.data}`
    );
    expect(res.body.status).toBe('Bad');
    expect(res.body.message).toBe('Invalid quest Id');
    const completedQuests = await user.getCompletedQuests();
    expect(completedQuests).toHaveLength(1);
  });
});