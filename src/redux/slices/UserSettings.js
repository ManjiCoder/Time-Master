import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOfficeMode: false,
};

const userSettings = createSlice({
  name: "userSettings",
  initialState,
  reducers: {
    toggleOfficeMode: (state, action) => {
      state.isOfficeMode = !state.isOfficeMode;
    },
  },
});

// Action creators are generated for each case reducer function
export const { toggleOfficeMode } = userSettings.actions;

export default userSettings.reducer;
