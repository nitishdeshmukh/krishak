import { configureStore } from '@reduxjs/toolkit';
import tableReducer from './slices/tableSlice';
import sidebarReducer from './slices/sidebarSlice';

export const store = configureStore({
    reducer: {
        table: tableReducer,
        sidebar: sidebarReducer,
    },
});

export default store;
