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
      className={`sticky top-0 w-full z-10 space-x-1 p-2 text-center shadow-md flex items-center justify-evenly text-slate-950 dark:text-white backdrop-blur  backdrop-brightness-125 ${extraStyle}`}
    >
      <h1 className="flex flex-1 space-x-1 justify-evenly items-center">
        {/* <span className="w-8 p-0.5 h-8 grid place-items-center text-sm font-semibold bg-white text-gray-900 rounded-full shadow-md">
          {days.toString().padStart(2, "0")}
        </span>{" "}
        <span className="text-sm ml-1">Days</span> */}
        <p
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
        </p>
        {/* <span className="text-sm mr-1">Avg</span>
        <span className="w-8 p-0.5 h-8 grid place-items-center text-sm font-semibold bg-white text-gray-900 rounded-full shadow-md">
          {avg}
        </span>{" "} */}
        <p>
          Days: <span className="font-bold">{days}</span>
        </p>
        <p>
          Avg: <span className="font-bold">{isNaN(avg) ? 0 : avg}</span>
        </p>
        {isShowAmt && pathname === '/' && !isNaN(salaryAmount) && (
          <>
            <p className="text-green-500 font-semibold">
              {salaryAmount.toLocaleString('en-IN', formatAmt)}
            </p>
            <p className="text-red-500 font-semibold">
              -{detuctedAmount.toLocaleString('en-IN', formatAmt)}
            </p>
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
