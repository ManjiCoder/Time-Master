import React, { useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import EditAmountModal from './EditAmountModal';
import { toggleIsShowAmt } from '@/redux/slices/dateSlice';
import { setMinRate, setOverTimeMinRate } from '@/redux/slices/UserSettings';
import { getDaysInMonth } from 'date-fns';
import { monthNameToIndex } from '@/utils/dateService';

export default function ToggleCheckBox() {
  const { salaryAmount, minRate } = useSelector((state) => state.userSettings);
  const {
    isShowAmt: isChecked,
    month,
    year,
  } = useSelector((state) => state.dateSlice);
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    dispatch(toggleIsShowAmt());
    const noOfDaysInMonth = getDaysInMonth(
      new Date().setFullYear(year, monthNameToIndex[month])
    );
    dispatch(setMinRate(salaryAmount / noOfDaysInMonth / 9 / 60));
    dispatch(setOverTimeMinRate(salaryAmount / 30 / 9 / 60));
    if (!salaryAmount) {
      setIsOpen(!isOpen);
    }
  };
  return (
    <>
      <label htmlFor='showAmt' className='flex items-center space-x-1.5'>
        <input
          type='checkbox'
          checked={isChecked}
          onChange={(e) => {}}
          id='showAmt'
          className='outline-none'
          onClick={handleClick}
        />
        <span className='mt-1'>{!isChecked ? 'Show' : 'hide'} Amount</span>
      </label>
      {isOpen && <EditAmountModal isOpen={isOpen} setIsOpen={setIsOpen} />}
    </>
  );
}
