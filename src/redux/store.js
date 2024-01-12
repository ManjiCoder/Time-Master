import { combineReducers, configureStore } from "@reduxjs/toolkit";
import UserSettings from "./slices/UserSettings";
import attendanceSlice from "./slices/attendanceSlice";

import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["userSettings", "attendance"],
};

const rootReducer = combineReducers({
  userSettings: UserSettings,
  attendance: attendanceSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = configureStore({
  reducer: persistedReducer,
});

export default store;

export const persistor = persistStore(store);
