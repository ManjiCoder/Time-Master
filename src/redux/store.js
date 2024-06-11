import { combineReducers, configureStore } from '@reduxjs/toolkit';
import UserSettings from './slices/UserSettings';
import attendanceSlice from './slices/attendanceSlice';

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
import storage from 'redux-persist/lib/storage';
import dateSlice from './slices/dateSlice';
import holidaysSlice from './slices/holidaysSlice';
import ProfessionalTax from './slices/ProfessionalTax';
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['userSettings', 'attendance', 'holidays', 'proTax'],
};

const rootReducer = combineReducers({
  userSettings: UserSettings,
  attendance: attendanceSlice,
  dateSlice,
  holidays: holidaysSlice,
  proTax: ProfessionalTax,
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
