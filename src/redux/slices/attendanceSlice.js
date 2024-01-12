import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  2024: "",
};

const attendanceSlice = createSlice({
  name: "attendance",
  initialState,
  reducers: {
    setLogin: (state, action) => {
      const { year, month, date } = action.payload;
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
      let arr = Object.keys(action.payload);
      let newObj = {};
      arr.map((v) => {
        newObj[v] = action.payload[v];
      });
      // return {...state,...newObj}
    },
  },
});

export const { setLogin, setPdfData } = attendanceSlice.actions;

export default attendanceSlice.reducer;
