import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const attendanceSlice = createSlice({
  name: "attendance",
  initialState,
  reducers: {
    setLogin: (state, action) => {
      const { year, month, date } = action.payload;
      console.log(year, month);
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
  },
});

export const { setLogin, setPdfData, deleteByDate } = attendanceSlice.actions;

export default attendanceSlice.reducer;
