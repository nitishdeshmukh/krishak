import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // localStorage
import tableReducer from './slices/tableSlice';
import sidebarReducer from './slices/sidebarSlice';
import authReducer from './slices/authSlice';
import languageReducer from './slices/languageSlice';
import confirmDialogReducer from './slices/confirmDialogSlice';

// Root reducer
const rootReducer = combineReducers({
    table: tableReducer,
    sidebar: sidebarReducer,
    auth: authReducer,
    language: languageReducer,
    confirmDialog: confirmDialogReducer,
});

// Persist config - only persist language slice
const persistConfig = {
    key: 'krishak',
    storage,
    whitelist: ['language'], // Only persist language state
};

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store with persisted reducer
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore redux-persist actions
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

// Create persistor
export const persistor = persistStore(store);

export default store;
