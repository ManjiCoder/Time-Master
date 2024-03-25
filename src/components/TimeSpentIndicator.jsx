import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import ListBoxMonths from './ListBoxMonths';
import ListBoxYears from './ListBoxYears';
import { useRouter } from 'next/router';
import { isHolidays, monthNameToIndex } from '@/utils/dateService';
import { getDate, getDaysInMonth } from 'date-fns';

export const formatAmt = {
  style: 'currency',
  currency: 'INR',
  currencyDisplay: 'symbol',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
};

export default function TimeSpentIndicator({
  isYearMonthPickerVisible = true,
  extraStyle = '',
}) {
  const currentDate = new Date().setHours(0, 0, 0, 0);
  const attendance = useSelector((state) => state.attendance);
  const { minRate, overTimeMinRate } = useSelector(
    (state) => state.userSettings
  );
  const { isShowAmt, year, month } = useSelector((state) => state.dateSlice);
  const years = Object.keys(attendance)
    .filter((v) => v !== 'undefined')
    .reverse();
  const { pathname } = useRouter();
  // const noOfDaysInMonth = getDaysInMonth(
  //   new Date().setFullYear(year, monthNameToIndex[month])
  // );

  const [totalTimeSpent, setTotalTimeSpent] = useState({
    hrs: 0,
    mins: 0,
    days: 0,
    workedDays: 0,
    totalHolidays: 0,
    holidaysLeft: 0,
    overTimeHrs: 0,
    overTimeMins: 0,
    overTimeDays: 0,
  });

  // Calculate total hours when attendance changes
  const totalTimeObj = () => {
    let payload = {
      hrs: 0,
      mins: 0,
      days: 0,
      workedDays: 0,
      totalHolidays: 0,
      holidaysLeft: 0,
      overTimeHrs: 0,
      overTimeMins: 0,
      overTimeDays: 0,
    };

    try {
      const timeLog = attendance[year][month];
      Object?.keys(timeLog).filter((v, i, a) => {
        v = parseInt(v);
        const parseDate = new Date(v);
        const dayNum = getDate(parseDate);
        const isHoliday = isHolidays(parseDate, dayNum);
        const isLeave = timeLog[v].leave === '1';

        if (timeLog[v].present !== '-') {
          if (!timeLog[v].isHoliday) {
            payload.days += 1;
          }
          payload.workedDays += parseFloat(timeLog[v].present);
          // TODO:Refractor
          let timeInHrsMin = timeLog[v].hours.split(':').filter((v, i) => {
            v = parseInt(v);
            if (i === 0) {
              payload.hrs = payload.hrs + v;
              if (isHoliday) {
                payload.overTimeHrs = payload.overTimeHrs + v;
              }
            } else {
              payload.mins = payload.mins + v;
              if (isHoliday) {
                payload.overTimeMins = payload.overTimeMins + v;
              }
            }
          });
        } else if (isLeave) {
          payload.days += 1;
          payload.workedDays += 1;
          payload.hrs += 9;
        }
        if (isHoliday) {
          payload.totalHolidays += 1;
          if (v >= currentDate) {
            payload.holidaysLeft += 1;
          }
        }
      });
      return payload;
    } catch (error) {
      console.log('object');
      return payload;
    }
  };

  useEffect(() => {
    // Update the state with the total hours
    const data = totalTimeObj();
    setTotalTimeSpent(data);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attendance, year, month]);

  const {
    days,
    hrs,
    mins,
    workedDays,
    totalHolidays,
    holidaysLeft,
    overTimeHrs,
    overTimeMins,
  } = totalTimeSpent;

  const holidaysTimeInMins = (totalHolidays - holidaysLeft) * 9 * 60;
  const overTimeInMins = overTimeHrs * 60 + overTimeMins;
  const totalTimeSpendInMins = hrs * 60 + mins;
  const totalExpectedTimeSpendInMins = days * 9 * 60;
  const timeDiffMins = -(totalExpectedTimeSpendInMins - totalTimeSpendInMins);
  const totalMinsR = Math.abs(timeDiffMins % 60);
  const totalHrsR = parseInt(Math.abs(timeDiffMins / 60));
  const rawAvg = totalTimeSpendInMins / 60 / days;
  const avg = Math.floor(rawAvg * 100) / 100;
  let salaryAmount = Math.round(
    totalTimeSpendInMins > totalExpectedTimeSpendInMins && overTimeInMins === 0
      ? totalExpectedTimeSpendInMins * minRate
      : (totalTimeSpendInMins + holidaysTimeInMins) * minRate
  );
  // For OverTime Calculation with 1x
  if (overTimeInMins !== 0) {
    const overTimeAmt = overTimeInMins * overTimeMinRate;
    salaryAmount =
      (totalTimeSpendInMins - overTimeInMins + holidaysTimeInMins) * minRate +
      overTimeAmt;
  }
  const expectedSalaryAmount = Math.round(
    (totalExpectedTimeSpendInMins + holidaysTimeInMins) * minRate
  );

  // const salaryAmount = isShowAmt
  //   ? Math.round(
  //       totalTimeSpendInMins * minRate + (30 - days) * 9 * 60 * minRate
  //     )
  //   : Math.round(totalTimeSpendInMins * minRate);
  // const expectedSalaryAmount = isShowAmt
  //   ? Math.round(
  //       totalExpectedTimeSpendInMins * ~minRate + (30 - days) * 9 * 60 * minRate
  //     )
  //   : Math.round(totalExpectedTimeSpendInMins * minRate);
  const detuctedAmount =
    Math.sign(expectedSalaryAmount - salaryAmount) === -1
      ? 0
      : -(expectedSalaryAmount - salaryAmount);

  return (
    <header
      className={`sticky top-0 w-full z-10 space-x-1 p-2 text-center shadow-md flex items-center justify-evenly text-slate-950 dark:text-white bg-white/70 dark:bg-slate-700/40 backdrop-blur-sm dark:backdrop-brightness-75 ${extraStyle}`}
    >
      <h1
        className={`flex flex-1 ${
          totalHrsR > 9 ? 'xs:text-[17px]' : 'xs:text-lg'
        } space-x-1 justify-evenly items-center max-xs:text-sm`}
      >
        <span
          className={`font-bold ${
            Math.sign(timeDiffMins) === -1 ? 'text-red-500' : 'text-green-500'
          }`}
        >
          <span
            className={`${
              Math.sign(timeDiffMins) === -1 ? 'text-red-500' : 'text-green-500'
            } font-bold`}
          >
            {Math.sign(timeDiffMins) === -1 ? '- ' : '+ '}
          </span>
          {totalHrsR > 0 && totalHrsR + 'hr : '}
          {totalMinsR}min
        </span>

        <span>
          Days: <span className='font-bold'> {workedDays}</span>
          {/* {noOfDaysInMonth - totalHolidays - workedDays > 0 && (
            <span className='font-bold text-red-500 ml-2'>
              -{noOfDaysInMonth - totalHolidays - workedDays}
            </span>
          )} */}
        </span>

        <span>
          Avg: <span className='font-bold'>{isNaN(avg) ? 0 : avg}</span>
        </span>
        {isShowAmt && pathname === '/' && !isNaN(salaryAmount) && (
          <>
            <span className='text-green-500 font-semibold'>
              {salaryAmount.toLocaleString('en-IN', formatAmt)}
            </span>
            <span className='text-red-500 font-semibold'>
              {detuctedAmount.toLocaleString('en-IN', formatAmt)}
            </span>
          </>
        )}
        {!isShowAmt && pathname === '/' && (
          <>
            <span>
              Hr:{' '}
              <span className='font-bold'>
                {Math.floor(totalTimeSpendInMins / 60)}
              </span>
            </span>
            <span>
              Min:{' '}
              <span className='font-bold'>{totalTimeSpendInMins % 60}</span>
            </span>
          </>
        )}
      </h1>
      {isYearMonthPickerVisible && (
        <>
          <ListBoxYears years={years} />
          <ListBoxMonths />
        </>
      )}
    </header>
  );
}
