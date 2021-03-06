import {createSlice, createSelector} from '@reduxjs/toolkit';

const initialState = {
  quests: [],
  myQuests: [],
  tasks: [],
  activeQuests: [],
  completedQuests: [],
  activeTasks: [],
  otherUserQuests: {
    completedQuests: [],
    activeQuests: [],
  }
};

export const questSlice = createSlice({
  name: 'quest',
  initialState: {
    ...initialState,
  },
  reducers: {
    clearState: state => {
      state = initialState;
    },
    getAllQuests: (state, body) => {
      state.quests = body.data.data;
    },
    getAllTasks: (state, body) => {
      state.tasks = body.data.data;
    },
    addQuest: (state, body) => {
      state.myQuests = body.data.data;
    },
    getActiveQuests: (state, body) => {
      state.activeQuests = body.data.data;
    },
    getCompletedQuests: (state, body) => {
      state.completedQuests = body.data.data;
    },
    getActiveTasks: (state, body) => {
      console.log('Inside ACTIVE TASKS--------------------'), body;
      state.activeTasks = body.data.data;
    },
    getOtherUserCompletedQuests: (state, body) => {
      state.otherUserQuests.completedQuests = body.data.data;
    },
    getOtherUserActiveQuests: (state, body) => {
      state.otherUserQuests.activeQuests = body.data.data;
    },
  },
});

export const {
  getAllQuests,
  getActiveQuests,
  clearState,
  getAllTasks,
  addQuest,
  getCompletedQuests,
  getActiveTasks,
  getOtherUserActiveQuests,
  getOtherUserCompletedQuests,
} = questSlice.actions;
export const questSelector = state => state.questInfo;

export default questSlice.reducer;
