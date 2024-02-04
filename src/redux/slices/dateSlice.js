import { createSlice } from '@reduxjs/toolkit';
import { format } from 'date-fns';

const initialState = {
  year: new Date().getFullYear(),
  month: format(new Date(), 'MMMM'),
  targetDate: null,
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
  },
});

// Action creators are generated for each case reducer function
export const { setYear, setMonth, setTargetDate } = dateSlice.actions;

export default dateSlice.reducer;
