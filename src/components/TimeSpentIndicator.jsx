import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import ListBoxMonths from './ListBoxMonths';
import ListBoxYears from './ListBoxYears';

export default function TimeSpentIndicator() {
  const attendance = useSelector((state) => state.attendance);
  const { year, month } = useSelector((state) => state.dateSlice);
  const years = Object.keys(attendance).reverse();

  const [totalTimeSpent, setTotalTimeSpent] = useState({
    hrs: 0,
    mins: 0,
    days: 0,
  });

  // Calculate total hours when attendance changes
  const totalHours = () => {
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
    const data = totalHours();
    setTotalTimeSpent(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attendance, year, month]);

  const { days, hrs, mins } = totalTimeSpent;
  const minsToHrs = mins / 60;
  const todayHrs = Math.floor(hrs + minsToHrs);
  const timeDiffMins = hrs * 60 - mins;
  const hrsRemaining =
    mins % 60 !== 0 ? days * 9 - todayHrs - 1 : days * 9 - todayHrs;
  const avg = (hrs + minsToHrs) / days;

  return (
    <header className="sticky top-0 w-full z-10  p-2 text-lg text-center shadow-md indicator text-white flex items-center justify-evenly">
      <h1 className="flex items-center">
        {/* {month} {year} */}
        <p
          className={`ml-2 font-bold ${
            Math.sign(-hrsRemaining) === -1 ? 'text-red-500' : 'text-green-500'
          }`}
        >
          <span
            className={`${
              Math.sign(-hrsRemaining) === -1
                ? 'text-red-500'
                : 'text-green-500'
            } font-bold`}
          >
            {Math.sign(-hrsRemaining) === -1 ? '- ' : '+ '}
          </span>
          {hrsRemaining > 0 && Math.abs(hrsRemaining) + 'hr : '}
          {timeDiffMins % 60}min
        </p>
      </h1>

      <p>
        Avg: <span>{Number.isNaN(avg) ? '0' : avg.toFixed(2)}</span>
      </p>

      <ListBoxYears years={years} />
      <ListBoxMonths />

      {/* </h1> */}
    </header>
  );
}
