import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { calculateTimeSpent, format24To12 } from '@/utils/dateService';
import { format } from 'date-fns';
import { setLogin } from '../redux/slices/attendanceSlice';

export default function CurrentTimeSpent({ loginTime, logoutTime }) {
  const attendance = useSelector((state) => state.attendance);
  const [timeSpent, seTimeSpent] = useState({
    hrs: 0o0,
    mins: 0o0,
    secs: 0o0,
    percent: 0o0,
  });
  const { isOfficeMode } = useSelector((state) => state.userSettings);
  // const currentDate = attendance[currentDateStr];
  const dispatch = useDispatch();
  // console.log(attendance);

  useEffect(() => {
    if (loginTime.length !== 0 && isOfficeMode) {
      let intervalId = setInterval(() => {
        const currentDate = new Date();
        const year = format(currentDate, 'yyyy');
        const month = format(currentDate, 'MMMM');
        const date = currentDate.setHours(0, 0, 0, 0);
        const logout = isOfficeMode ? format(new Date(), 'HH:mm') : logoutTime;
        let timeSpendPayload = calculateTimeSpent(loginTime, logout);
        seTimeSpent(timeSpendPayload);

        // IIFE
        const isTodayData = (() => {
          try {
            return attendance[year][month][date];
          } catch (error) {
            return {};
          }
        })();

        // console.table(isTodayData)

        const payload = {
          date: format(date, 'yyyy-MM-dd'),
          login: format24To12(loginTime),
          logout: format24To12(logout),
          hours: `${timeSpendPayload.hrs
            .toString()
            .padStart(2, '0')}:${timeSpendPayload.mins
            .toString()
            .padStart(2, '0')}`,
          present: '1',
        };
        if (loginTime !== '') {
          try {
            dispatch(
              setLogin({
                year,
                month,
                date,
                [date]: { ...isTodayData, ...payload },
              })
            );
          } catch (error) {
            dispatch(
              setLogin({
                year,
                month,
                date,
                [date]: payload,
              })
            );
          }
        }

        // console.log(timeSpendPayload.percent);
      }, 1000);
      // console.log({ intervalId });

      // Clean up
      return () => {
        clearInterval(intervalId);
      };
    }
    if (loginTime.length !== 0 && loginTime.length !== 0 && !isOfficeMode) {
      let timeSpendPayload = calculateTimeSpent(loginTime, logoutTime);
      seTimeSpent(timeSpendPayload);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOfficeMode, loginTime, logoutTime]);

  if (loginTime.length === 0) {
    return (
      <p className='text-sm capitalize text-red-700'>
        Select the time first & then try again!
      </p>
    );
  }

  return (
    <div className='flex flex-col gap-4'>
      {/* <h2 className="text-lg">
        Your current time spend:{" "}
        <b className="text-red-600">
          {`${timeSpent?.hrs} hrs ${timeSpent?.mins} mins ${timeSpent?.secs} sec`}
        </b>
      </h2> */}

      <section className='flex items-center justify-center'>
        <svg className='-rotate-90 scale-90 fill-none' height={300} width={300}>
          <circle
            className='stroke-slate-700'
            cx={150}
            cy={150}
            r={135}
            strokeWidth={12}
          ></circle>
          <circle
            className='stroke-green-600 transition-all duration-500 ease-in-out'
            cx={150}
            cy={150}
            r={135}
            strokeDasharray={848}
            strokeLinecap='round'
            style={{
              strokeDashoffset: `calc(848 - (848 * ${
                timeSpent?.percent > 100 ? 100 : timeSpent.percent
              }) / 100)`,
            }}
            strokeWidth={16}
          ></circle>
          {/* Start After 100% */}
          {timeSpent.percent > 100 && (
            <circle
              className='stroke-green-800 transition-all duration-500 ease-in-out dark:stroke-green-900'
              cx={150}
              cy={150}
              r={135}
              strokeDasharray={848}
              strokeLinecap='round'
              style={{
                strokeDashoffset: `calc(848 - (848 * ${
                  timeSpent?.percent - 100
                }) / 100)`,
              }}
              strokeWidth={16}
            ></circle>
          )}
        </svg>
        <div className='absolute flex flex-col items-center justify-center text-center'>
          <span className='mt-9 text-4xl font-semibold'>
            {timeSpent?.percent}
            <span className='pb-2 text-3xl'>%</span>
            {/* <sub>{timeSpent.secs}</sub> */}
          </span>

          <span className='text-sm text-green-900 dark:text-green-400'>
            {`+${timeSpent?.hrs} hr : ${timeSpent?.mins} min `}
          </span>
          {timeSpent?.hrs <= 8 && (
            <span className='text-sm text-red-900 dark:text-red-500'>
              {`${-(8 - timeSpent?.hrs) + ' hr'} : ${
                60 - timeSpent?.mins + ' min '
              }`}
            </span>
          )}
        </div>
      </section>
    </div>
  );
}
