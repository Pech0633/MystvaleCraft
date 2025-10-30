import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  rederm: false,
};

const redermSlice = createSlice({
  name: 'rederm',
  initialState,
  reducers: {
    showrederm: (state, action) => {
      state.rederm = action.payload;
    },
    hiderederm: (state) => {
      state.rederm = false;
    },
    show: (state) => {
      state.rederm = true;
    },
  },
});

export const { showrederm, hiderederm, show } = redermSlice.actions;
export default redermSlice.reducer;
