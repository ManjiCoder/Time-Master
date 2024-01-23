import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export default function TimeSpentIndicator({ year, month }) {
  const attendance = useSelector((state) => state.attendance);

  const [totalTimeSpent, setTotalTimeSpent] = useState({
    hrs: 0,
    mins: 0,
    days: 0,
  });

  useEffect(() => {
    // Calculate total hours when attendance changes
    const totalHours = () => {
      let payload = {
        hrs: 0,
        mins: 0,
        days: 0,
      };
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
      console.log(payload.days);
      return payload;
    };

    // Update the state with the total hours
    const data = totalHours();
    setTotalTimeSpent(data);
  }, [attendance, year, month]);

  const { days, hrs, mins } = totalTimeSpent;
  const minsToHrs = mins / 60;
  const todayHrs = Math.floor(hrs + minsToHrs);
  const timeDiffMins = totalTimeSpent.hrs * 60 - totalTimeSpent.mins;

  return (
    <header className="sticky top-0 w-full z-10  p-2 text-lg text-center shadow-md indicator text-white">
      <h1>
        {month} {year}
        <span className="ml-2 font-bold text-red-500">
          - {mins % 60 !== 0 ? days * 9 - todayHrs - 1 : days * 9 - todayHrs}{' '}
          hrs : {timeDiffMins % 60} mins
        </span>
      </h1>
      <h1 className="text-xs font-extralight flex justify-between px-5">
        <p>
          Time: <span>{totalTimeSpent.days} Days</span>
          <span> {totalTimeSpent.hrs} hrs</span>
          <span> {totalTimeSpent.mins} mins </span>
        </p>
        <p>
          Avg:{' '}
          <span>
            {(totalTimeSpent.hrs / totalTimeSpent.days).toFixed(2)} hrs,
          </span>
          <span> {(totalTimeSpent.mins / 60).toFixed(2)} mins</span>
        </p>
      </h1>
    </header>
  );
}
