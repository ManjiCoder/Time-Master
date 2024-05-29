import React from 'react';
import { isHolidays } from '@/utils/dateService';
import { format, getDate } from 'date-fns';
import { useSelector } from 'react-redux';

export default function ExtraTimePerDay() {
  const attendance = useSelector((state) => state.attendance);
  const { year, month } = useSelector((state) => state.dateSlice);
  const currentDate = new Date();
  const date = currentDate.setHours(0, 0, 0, 0);

  const totalTimeObj = () => {
    let payload = {
      hrs: 0,
      mins: 0,
      days: 0,
      workedDays: 0,
      absentDays: 0,
      totalHolidays: 0,
      holidaysLeft: 0,
      overTimeHrs: 0,
      overTimeMins: 0,
      overTimeDays: 0,
      daysLeft: 0,
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
              // TODO: For Leave if (isHoliday || isLeave) {
              if (isHoliday) {
                payload.overTimeDays = payload.overTimeDays + 1;
              }
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
        if (timeLog[v].present === '-' && !isHoliday && !isLeave) {
          payload.absentDays += 1;
        }
        if (timeLog[v].present === '-' && !isHoliday && !isLeave) {
          if (v >= date) {
            payload.daysLeft += 1;
          }
        }
      });
      return payload;
    } catch (error) {
      // console.log('object');
      return payload;
    }
  };

  const {
    days: tDays,
    hrs,
    mins,
    workedDays,
    totalHolidays,
    holidaysLeft,
    overTimeHrs,
    overTimeMins,
    overTimeDays,
    absentDays,
    daysLeft,
  } = totalTimeObj();

  const days = tDays - overTimeDays;

  const totalTimeSpendInMins = hrs * 60 + mins;
  const totalExpectedTimeSpendInMins = days * 9 * 60;
  const timeDiffMins = -(totalExpectedTimeSpendInMins - totalTimeSpendInMins);
  const totalMinsR = Math.abs(timeDiffMins % 60);
  const totalHrsR = parseInt(Math.abs(timeDiffMins / 60));
  const timeToCoverPerDay = (totalHrsR * 60 + totalMinsR) / daysLeft;
  const hrsPerDay = Math.floor(timeToCoverPerDay / 60);
  const minPerDay = Math.floor(timeToCoverPerDay % 60);
  // console.log(hrsPerDay, minPerDay);

  if (
    Math.sign(timeDiffMins) === -1 &&
    daysLeft !== 0 &&
    month === format(currentDate, 'MMMM')
  )
    return (
      <p className='flex flex-col items-center justify-center text-center ml-4'>
        <span
          className={`font-semibold xs:text-lg ${
            Math.sign(timeDiffMins) === -1
              ? 'dark:text-red-500 text-red-600'
              : 'dark:text-green-500 text-green-600'
          }`}
        >
          <span className='text-xl'>-</span>{' '}
          {hrsPerDay.toString().padStart(2, '0')}:
          {minPerDay.toString().padStart(2, '0')}
        </span>
        <span className='text-[0.57rem] -mt-1.5'>Extra-Time/Day</span>
      </p>
    );
  return null;
}
