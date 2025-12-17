import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    activeView: 'entry',
};

const sidebarSlice = createSlice({
    name: 'sidebar',
    initialState,
    reducers: {
        setActiveView: (state, action) => {
            state.activeView = action.payload;
        },
        toggleView: (state) => {
            state.activeView = state.activeView === 'entry' ? 'reports' : 'entry';
        },
    },
});

export const { setActiveView, toggleView } = sidebarSlice.actions;
export default sidebarSlice.reducer;
