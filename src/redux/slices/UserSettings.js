import { createSlice } from '@reduxjs/toolkit';
import { format } from 'date-fns';

export const filterObj = Object.freeze({
  date: 'Date',
  present: 'Today',
});

export const filterOrder = Object.freeze({
  ascending: 'Ascending',
  descending: 'Descending',
});

const initialState = {
  isOfficeMode: false,
  // isShowAmt: false,
  year: new Date().getFullYear(),
  month: format(new Date(), 'MMMM'),
  salaryAmount: null,
  // minRate: 0.9259259259259259,
  minRate: null,
  overTimeMinRate: null,
  theme: 'system',
  sortBy: filterObj.date,
  order: filterOrder.ascending,
};

const userSettings = createSlice({
  name: 'userSettings',
  initialState,
  reducers: {
    toggleOfficeMode: (state, action) => {
      state.isOfficeMode = !state.isOfficeMode;
    },
    setIsOfficeMode: (state, action) => {
      state.isOfficeMode = action.payload;
    },
    // toggleIsShowAmt: (state, action) => {
    //   state.isShowAmt = !state.isShowAmt;
    // },
    setSalaryAmount: (state, action) => {
      state.salaryAmount = action.payload;
    },
    setMinRate: (state, action) => {
      state.minRate = action.payload;
    },
    updateTheme: (state, action) => {
      state.theme = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    setSortByOrder: (state, action) => {
      state.order = action.payload;
    },
    setOverTimeMinRate: (state, action) => {
      state.overTimeMinRate = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  toggleOfficeMode,
  setIsOfficeMode,
  // toggleIsShowAmt,
  setSalaryAmount,
  setMinRate,
  updateTheme,
  setSortBy,
  setSortByOrder,
  setOverTimeMinRate,
} = userSettings.actions;

export default userSettings.reducer;
