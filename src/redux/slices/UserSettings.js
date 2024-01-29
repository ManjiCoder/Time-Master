import { createSlice } from "@reduxjs/toolkit";
import { format } from "date-fns";

const initialState = {
  isOfficeMode: false,
  isShowAmt: false,
  year: new Date().getFullYear(),
  month: format(new Date(), "MMMM"),
  salaryAmount: null,
  // minRate: 0.9259259259259259,
  minRate: null,
};

const userSettings = createSlice({
  name: "userSettings",
  initialState,
  reducers: {
    toggleOfficeMode: (state, action) => {
      state.isOfficeMode = !state.isOfficeMode;
    },
    toggleIsShowAmt: (state, action) => {
      state.isShowAmt = !state.isShowAmt;
    },
    setSalaryAmount: (state, action) => {
      state.salaryAmount = action.payload;
    },
    setMinRate: (state, action) => {
      state.minRate = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  toggleOfficeMode,
  toggleIsShowAmt,
  setSalaryAmount,
  setMinRate,
} = userSettings.actions;

export default userSettings.reducer;
