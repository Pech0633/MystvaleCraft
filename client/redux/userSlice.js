import { createSlice } from '@reduxjs/toolkit';

// Corrected initial state variable name
const initialState = {
    id: -1,
    username: '',
    realname: '',
    point: 0,
    RP: 0,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state, action) => {
            state.id = action.payload.id;
            state.username = action.payload.username;
            state.realname = action.payload.realname;
            state.point = action.payload.point;
            state.RP = action.payload.RP;
        },
        logout: (state) => {
            state.id = -1;
            state.username = '';
            state.realname = '';
            state.point = 0;
        },
        setPoint: (state, action) => {
            state.point = action.payload; // รับค่า point ใหม่จาก action.payload
        },
    },
});


// Export the actions and reducer
export const { login, logout, setPoint } = userSlice.actions;
export default userSlice.reducer;