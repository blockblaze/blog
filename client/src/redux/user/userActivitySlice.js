import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  ratedPosts: [],
  visitedPosts: [],
  downloads: [],
};

const userActivitySlice = createSlice({
  name: 'userActivity',
  initialState,
  reducers: {
    addVisitedPost: (state , action)=>{
        if(!state.visitedPosts.includes(action.payload)){
            state.visitedPosts.push(action.payload);
        }

    },
    addRatedPost: (state , action)=>{
        if(!state.ratedPosts.includes(action.payload)){
            state.ratedPosts.push(action.payload);
        }
    },
    addDownloads: (state , action)=>{
        if(!state.downloads.includes(action.payload)){
            state.downloads.push(action.payload);
        }
    }
    
  },
});

export const {
    addVisitedPost,
    addRatedPost,
    addDownloads,
} = userActivitySlice.actions;

export default userActivitySlice.reducer;