import {createSlice, createSelector} from '@reduxjs/toolkit';

const initialState = {
  myFriends: [],
};

export const friendSlice = createSlice({
  name: 'friend',
  initialState: {
    ...initialState,
  },
  reducers: {
    clearState: state => {
      state = initialState;
    },
    getAllFriends: (state, body) => {
      state.myFriends = body.data.data;
    },
  },
});

export const {getAllFriends} = friendSlice.actions;
export const friendSelector = state => state.friendInfo;

export default friendSlice.reducer;