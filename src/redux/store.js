import { combineReducers, configureStore } from '@reduxjs/toolkit';
import UserSettings from './slices/UserSettings';
import attendanceSlice from './slices/attendanceSlice';

import storage from 'redux-persist/lib/storage';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from 'redux-persist';
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['userSettings', 'attendance'],
};

const rootReducer = combineReducers({
  userSettings: UserSettings,
  attendance: attendanceSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export default store;

export const persistor = persistStore(store);
