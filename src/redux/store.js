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
import dateSlice from './slices/dateSlice';
import holidaysSlice from './slices/holidaysSlice';
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['userSettings', 'attendance', 'holidays'],
};

const rootReducer = combineReducers({
  userSettings: UserSettings,
  attendance: attendanceSlice,
  dateSlice,
  holidays: holidaysSlice,
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
