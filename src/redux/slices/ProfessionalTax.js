import { createSlice } from '@reduxjs/toolkit';
import { format } from 'date-fns';

const initialState = {
  month: format(new Date(), 'MMMM'),
  taxRates: {
    January: 200,
    February: 300,
    March: 200,
    April: 200,
    May: 200,
    June: 200,
    July: 200,
    August: 200,
    September: 200,
    October: 200,
    November: 200,
    December: 200,
  },
};

const professionalTax = createSlice({
  name: 'professionalTax',
  initialState,
  reducers: {
    setMonthTax: (state, action) => {
      const { month, amount } = action.payload;
      state.taxRates[month] = amount;
    },
    setTaxRates: (state, action) => {
      state.taxRates = action.payload;
    },
  },
});

export const { setMonthTax, setTaxRates } = professionalTax.actions;
export default professionalTax.reducer;
