import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import ListBoxMonths from './ListBoxMonths';
import ListBoxYears from './ListBoxYears';
import { useRouter } from 'next/router';

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
  const attendance = useSelector((state) => state.attendance);
  const { isShowAmt, minRate } = useSelector((state) => state.userSettings);
  const { year, month } = useSelector((state) => state.dateSlice);
  const years = Object.keys(attendance).reverse();
  const { pathname } = useRouter();

  // const [minsRate, setMinsRate] = useState(second)

  const [totalTimeSpent, setTotalTimeSpent] = useState({
    hrs: 0,
    mins: 0,
    days: 0,
  });

  // Calculate total hours when attendance changes
  const totalTimeObj = () => {
    let payload = {
      hrs: 0,
      mins: 0,
      days: 0,
    };

    try {
      Object?.keys(attendance[year][month]).filter((v, i, a) => {
        v = parseInt(v);
        if (attendance[year][month][v].present !== '-') {
          payload.days += 1;

          let timeInHrsMin = attendance[year][month][v].hours
            .split(':')
            .filter((v, i) => {
              v = parseInt(v);
              if (i === 0) {
                payload.hrs = payload.hrs + v;
              } else {
                payload.mins = payload.mins + v;
              }
            });
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

  const { days, hrs, mins } = totalTimeSpent;
  const totalTimeSpendInMins = hrs * 60 + mins;
  const totalExpectedTimeSpendInMins = days * 9 * 60;
  const timeDiffMins = -(totalExpectedTimeSpendInMins - totalTimeSpendInMins);
  const totalMinsR = Math.abs(timeDiffMins % 60);
  const totalHrsR = parseInt(Math.abs(timeDiffMins / 60));
  const rawAvg = totalTimeSpendInMins / 60 / days;
  const avg = Math.floor(rawAvg * 100) / 100;
  const salaryAmount = Math.round(totalTimeSpendInMins * minRate);
  const expectedSalaryAmount = Math.round(
    totalExpectedTimeSpendInMins * minRate
  );
  const detuctedAmount = expectedSalaryAmount - salaryAmount;

  return (
    <header
      className={`sticky top-0 w-full z-10 space-x-1 p-2 text-center shadow-md flex items-center justify-evenly text-slate-950 dark:text-white bg-white/70 dark:bg-slate-700/40 backdrop-blur-sm dark:backdrop-brightness-75 ${extraStyle}`}
    >
      <h1 className="flex flex-1 xs:text-lg space-x-1 justify-evenly items-center">
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
          Days: <span className="font-bold">{days}</span>
        </span>
        <span>
          Avg: <span className="font-bold">{isNaN(avg) ? 0 : avg}</span>
        </span>
        {isShowAmt && pathname === '/' && !isNaN(salaryAmount) && (
          <>
            <span className="text-green-500 font-semibold">
              {salaryAmount.toLocaleString('en-IN', formatAmt)}
            </span>
            <span className="text-red-500 font-semibold">
              -{detuctedAmount.toLocaleString('en-IN', formatAmt)}
            </span>
          </>
        )}
        {!isShowAmt && pathname === '/' && (
          <>
            <span>
              Hr:{' '}
              <span className="font-bold">
                {Math.floor(totalTimeSpendInMins / 60)}
              </span>
            </span>
            <span>
              Min:{' '}
              <span className="font-bold">{totalTimeSpendInMins % 60}</span>
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
