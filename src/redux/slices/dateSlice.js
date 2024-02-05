import { createSlice } from '@reduxjs/toolkit';
import { format } from 'date-fns';

const initialState = {
  year: new Date().getFullYear(),
  month: format(new Date(), 'MMMM'),
  targetDate: null,
  isShowAmt: false,
};

// const initialState = {
//   year: 2023,
//   month: "December",
//   targetDate: null,
// };

const dateSlice = createSlice({
  name: 'dateSlice',
  initialState,
  reducers: {
    setYear: (state, action) => {
      state.year = action.payload;
    },
    setMonth: (state, action) => {
      state.month = action.payload;
    },
    setTargetDate: (state, action) => {
      state.targetDate = action.payload;
    },
    toggleIsShowAmt: (state, action) => {
      state.isShowAmt = !state.isShowAmt;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setYear, setMonth, setTargetDate, toggleIsShowAmt } =
  dateSlice.actions;

export default dateSlice.reducer;
