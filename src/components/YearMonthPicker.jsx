import { monthNameToIndex } from '@/utils/dateService';
import React from 'react';

export default function YearMonthPicker({ defaultDate, setExpDetails }) {
  const handleChange = (e) => {
    const yearMonth = e.target.value.split('-');
    if (yearMonth.length !== 0) {
      setExpDetails({
        year: yearMonth[0],
        month: Object.keys(monthNameToIndex)[parseInt(yearMonth[1] - 1)],
      });
    }
  };
  return (
    <input
      className='outline-none text-sm font-medium ml-1.5 focus-within:ring-2 rounded-md shadow-md px-1 py-2 dark:bg-black/20 bg-slate-100'
      type='month'
      onChange={handleChange}
      defaultValue={defaultDate}
    />
  );
}
