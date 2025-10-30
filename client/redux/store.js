import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice'; 
import loginReducer from './storage/LoginSlice'; 
import slideReducer from './storage/promotion';  
import ranksReducer from './storage/ranks'; 
import newsReducer from './storage/news';
import redermReducer from './storage/rederm';

const store = configureStore({
  reducer: {
    user: userReducer,
    login: loginReducer,
    slides: slideReducer, 
    ranks: ranksReducer, 
    news: newsReducer,
    rederm: redermReducer,
  },
});

export default store;
