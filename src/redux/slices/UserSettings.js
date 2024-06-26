import { createSlice } from '@reduxjs/toolkit';
import { format } from 'date-fns';

export const filterObj = Object.freeze({
  fullMonth: 'Month',
  today: 'Today',
  holidays: 'Holidays',
  absent: 'Absent',
  present: 'Present',
});

export const filterOptions = [
  filterObj.fullMonth,
  filterObj.today,
  filterObj.holidays,
  filterObj.present,
  filterObj.absent,
];

export const filterOrder = Object.freeze({
  ascending: 'Ascending',
  descending: 'Descending',
});

const initialState = {
  userName: '',
  isOfficeMode: false,
  // isShowAmt: false,
  year: new Date().getFullYear(),
  month: format(new Date(), 'MMMM'),
  salaryAmount: null,
  // minRate: 0.9259259259259259,
  minRate: null,
  overTimeMinRate: null,
  theme: 'system',
  sortBy: filterObj.today,
  order: filterOrder.descending,
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
    setUserName: (state, action) => {
      state.userName = action.payload;
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
  setUserName,
} = userSettings.actions;

export default userSettings.reducer;
