import { createSlice } from '@reduxjs/toolkit';

const initialState = {};

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    setCurrentTimeSpent: (state, action) => {
      try {
        const { year, month, date } = action.payload;
        state[year][month][date] = action.payload[date];
      } catch (error) {
        console.log(error);
      }
    },
    setLogin: (state, action) => {
      const { year, month, date } = action.payload;
      // console.log(year, month);
      // if date is not present
      if (!state[year]) {
        state[year] = {};
      }
      if (!state[year][month]) {
        state[year][month] = {};
      }
      if (!state[year][month][date]) {
        state[year][month][date] = action.payload[date];
      }
      // // Check if the day already exists
      if (state[year][month][date]) {
        state[year][month][date] = action.payload[date];
      }
    },
    setPdfData: (state, action) => {
      const { year, month, data } = action.payload;
      // console.log(year, month);
      // if date is not present
      if (!state[year]) {
        state[year] = {};
      }
      if (!state[year][month]) {
        state[year][month] = {};
      }

      Object?.keys(data).map((v) => {
        // console.log(v);
        if (!state[year][month][v]) {
          state[year][month][v] = data[v];
        }
        // // Check if the day already exists
        if (state[year][month][v]) {
          state[year][month][v] = data[v];
        }
      });
    },
    deleteByDate: (state, action) => {
      const { year, month, date } = action.payload;
      delete state[year][month][date];
    },
    editByDate: (state, action) => {
      const { year, month, date, data } = action.payload;
      // console.log(state[year][month][date]);
      state[year][month][date] = data;
    },
  },
});

export const {
  setCurrentTimeSpent,
  setLogin,
  setPdfData,
  deleteByDate,
  editByDate,
} = attendanceSlice.actions;

export default attendanceSlice.reducer;
