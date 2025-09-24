import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLogin: false,  
};

const loginSlice = createSlice({
  name: 'login',
  initialState,  
  reducers: {
    showlogin: (state, action) => {
      state.isLogin = action.payload;
    },
    hidelogin: (state) => {
      state.isLogin = false;
    },
    show: (state) => {
      state.isLogin = true;
    },
  },
});

export const { showlogin, hidelogin, show } = loginSlice.actions;
export default loginSlice.reducer;
