import { createSlice } from '@reduxjs/toolkit';

const initialState = {};

const holidaysSlice = createSlice({
  name: 'holidays',
  initialState,
  reducers: {
    setHolidays: (state, action) => {
      return action.payload;
      // if (Object.keys(state).length === 0) {
      // }
    },
  },
});

// Action creators are generated for each case reducer function
export const { setHolidays } = holidaysSlice.actions;

export default holidaysSlice.reducer;
