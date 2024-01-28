import { createSlice } from '@reduxjs/toolkit';
import { format } from 'date-fns';

const initialState = {
  isOfficeMode: false,
  year: new Date().getFullYear(),
  month: format(new Date(), 'MMMM'),
  salaryAmout: null,
  minRate: null,
};

const userSettings = createSlice({
  name: 'userSettings',
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
