import { Baloo_Bhai_2 } from 'next/font/google';
import TimeSpentIndicator from '@/components/TimeSpentIndicator';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { format, getDate, isSaturday, isSunday } from 'date-fns';
import {
  ArrowDownCircleIcon,
  ArrowUpCircleIcon,
  PencilSquareIcon,
  TrashIcon,
} from '@heroicons/react/20/solid';
import { setTargetDate } from '@/redux/slices/dateSlice';
import {
  calculateTimeSpent,
  format24To12,
  formattedTime12,
  removeAMorPM,
} from '@/utils/dateService';
import DeleteModal from '@/components/DeleteModal';
import EditModal from '@/components/EditModal';
import { setCurrentTimeSpent, setLogin } from '@/redux/slices/attendanceSlice';
import {
  filterObj,
  filterOrder,
  setSortByOrder,
} from '@/redux/slices/UserSettings';
import ListBoxFilter from '@/components/ListBoxFilter';
import ToogleBtn from '@/components/HeadlessUI/ToggleBtn';
import { toast } from 'react-toastify';

const inter = Baloo_Bhai_2({ subsets: ['latin'] });

// Holidays List
const holidays = {
  1706207400000: '26-Jan-2024',
  1711305000000: '25-Mar-2024',
  1712773800000: '11-Apr-2024',
  1714501800000: '01-May-2024',
  1723660200000: '15-Aug-2024',
  1725647400000: '07-Sep-2024',
  1727807400000: '02-Oct-2024',
  1728671400000: '12-Oct-2024',
  1730399400000: '01-Nov-2024',
  1735065000000: '25-Dec-2024',
};

export default function Attendance() {
  const attendance = useSelector((state) => state.attendance);
  const { isOfficeMode, sortBy, order } = useSelector(
    (state) => state.userSettings
  );
  const { year, month } = useSelector((state) => state.dateSlice);
  const dispatch = useDispatch();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const currentDate = new Date();
  const date = currentDate.setHours(0, 0, 0, 0);

  useEffect(() => {
    if (isOfficeMode && attendance[year][month][date]?.login !== '-') {
      let intervalId = setInterval(() => {
        try {
          const year = format(currentDate, 'yyyy');
          const month = format(currentDate, 'MMMM');

          const todayDateObj = attendance[year][month][date];
          const { login: loginRaw } = todayDateObj;
          const login = removeAMorPM(loginRaw);
          const logout = format(new Date(), 'HH:mm');
          let timeSpendPayload = calculateTimeSpent(login, logout);

          const payload = {
            ...todayDateObj,
            date,
            login,
            logout,
            hours: `${timeSpendPayload.hrs
              .toString()
              .padStart(2, '0')}:${timeSpendPayload.mins
              .toString()
              .padStart(2, '0')}`,
          };

          dispatch(
            setCurrentTimeSpent({
              year,
              month,
              date,
              [date]: payload,
            })
          );
        } catch (error) {
          // TODO
        }
        // console.log(payload);
      }, 1000);

      return () => {
        clearInterval(intervalId);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOfficeMode, year, month]);

  if (attendance[year] === undefined || attendance[year][month] === undefined) {
    return (
      <main
        className={`bg-slate-300 dark:bg-slate-900 dark:text-white text-slate-800 min-h-screen pb-16 ${inter.className}`}
      >
        <TimeSpentIndicator
          year={year}
          month={month}
        />
        <h2 className='text-xl text-center mt-5'>No Data Found!</h2>
      </main>
    );
  }

  const allDates = Object.keys(attendance[year][month]);
  const tillTodayDates = Object.keys(attendance[year][month]).filter(
    (v) => v <= new Date().setHours(0, 0, 0, 0)
  );
  const showDates = sortBy === filterObj.present ? tillTodayDates : allDates;
  const data = calculateTimeSpent(
    removeAMorPM(attendance[year][month][date]?.login),
    removeAMorPM(attendance[year][month][date]?.logout)
  );
  // console.log(data);
  return (
    <main
      className={`bg-slate-300 dark:bg-slate-900 text-slate-800 min-h-screen pb-16 ${inter.className}`}
    >
      <TimeSpentIndicator />
      <section className='flex font-semibold justify-between mx-2 mt-2 space-x-1 items-center dark:text-white'>
        {/* <span>Sort By Date : </span> */}
        <div className='flex items-center space-x-1'>
          <ToogleBtn />
          {data && !Object.values(data).includes(NaN) && (
            <>
              <p className='flex flex-col items-center justify-center text-center'>
                <span className='font-semibold text-[18px] w-16'>
                  {data.hrs}:{data.mins.toString().padStart(2, '0')}:
                  {data.secs.toString().padStart(2, '0')}
                </span>
                <span className='text-[0.57rem] -mt-1.5'>Time Spend</span>
              </p>
              <span className='font-semibold pl-2 text-green-700 dark:text-green-400 text-xl'>
                {data.percent}%
              </span>
            </>
          )}
        </div>

        <div className='flex space-x-1'>
          <ListBoxFilter />

          <button
            type='button'
            onClick={() => dispatch(setSortByOrder(filterOrder.ascending))}
          >
            <ArrowUpCircleIcon
              className={`h-6 w-6 text-white dark:text-slate-800 bg-slate-800 dark:bg-white rounded-full shadow-md ${
                order === filterOrder.ascending ? 'opacity-100' : 'opacity-70'
              }`}
            />
          </button>

          <button
            type='button'
            onClick={() => dispatch(setSortByOrder(filterOrder.descending))}
          >
            <ArrowDownCircleIcon
              className={`h-6 w-6 text-white dark:text-slate-800 bg-slate-800 dark:bg-white rounded-full shadow-md ${
                order === filterOrder.descending ? 'opacity-100' : 'opacity-70'
              }`}
            />
          </button>
        </div>
      </section>

      {showDates
        .sort((a, b) => {
          a = parseInt(a);
          b = parseInt(b);
          if (order === filterOrder.ascending) {
            return a - b;
          } else if (order === filterOrder.descending) {
            return b - a;
          }
        })
        .map((date) => {
          const parseDate = new Date(parseInt(date));
          const day = format(parseDate, 'EEEE');
          const dayNum = getDate(parseDate);
          const isHoliday =
            (isSaturday(parseDate) &&
              (dayNum <= 7 || (dayNum > 14 && dayNum <= 21))) ||
            isSunday(parseDate) ||
            Object.values(holidays).includes(format(parseDate, 'dd-MMM-yyyy'));

          const obj = attendance[year][month][date];
          let loginTime = obj.login;
          let logoutTime = obj.logout;
          loginTime = loginTime ? formattedTime12(loginTime) : '00:00';
          logoutTime = logoutTime ? format24To12(logoutTime) : '00:00';

          if (!obj.login.includes(':')) {
            loginTime = '-';
          }
          if (!obj.logout.includes(':')) {
            logoutTime = '-';
          }

          // if (obj.present === '-') return;
          // // TODO: total days

          return (
            <section
              key={date}
              className='h-36 md:h-44 w-full md:max-w-xl lg:max-w-2xl p-2 flex m-auto'
            >
              <div className='bg-cyan-800 w-[30%] flex flex-col items-center justify-center rounded-l-lg'>
                <div className='bg-slate-50 w-[70%] rounded-tr-lg rounded-tl-lg h-6 mb-0.5 text-sm font-bold grid place-items-center'>
                  {day}
                </div>
                <div
                  className={`bg-slate-100 w-[70%] rounded-br-lg rounded-bl-lg h-16 grid place-items-center font-bold text-4xl ${
                    isHoliday && 'text-red-500'
                  } `}
                >
                  {dayNum.toString().padStart(2, '0')}
                </div>
              </div>

              <div className='bg-slate-800 w-[70%] rounded-r-lg grid items-center justify-center font-bold text-white flex-col relative pt-2'>
                <div className='flex justify-center text-sm md:text-base md:pb-2'>
                  <p>
                    <span className='font-semibold'>
                      {format(parseDate, 'dd-MMM-yyyy')}
                    </span>
                  </p>
                  {/* Edit-Btn */}
                  <button
                    className='text-blue-500 absolute right-3 hover:text-blue-400'
                    onClick={() => {
                      setIsEditOpen(!isEditOpen);
                      dispatch(setTargetDate(date));
                    }}
                  >
                    <PencilSquareIcon className='w-5' />
                  </button>
                  {/* Delete-Btn */}
                  <button
                    className='text-red-500 absolute left-3 hover:text-red-400'
                    onClick={() => {
                      setIsDeleteOpen(!isDeleteOpen);
                      dispatch(setTargetDate(date));
                    }}
                  >
                    <TrashIcon className='w-5' />
                  </button>
                </div>
                <div className='flex text-center gap-1'>
                  <div>
                    <div
                      className={`bg-slate-600 flex items-center justify-center w-[5rem] md:w-28 max-w-full text-center rounded-md shadow-md text-xl font-bold py-3 px-2 `}
                    >
                      {loginTime?.toLowerCase().includes('am')
                        ? loginTime.slice(0, loginTime.length - 3)
                        : loginTime?.toLowerCase().includes('pm')
                        ? loginTime.slice(0, loginTime.length - 3)
                        : loginTime}
                      <span className='ml-0.5 -mb-1.5 text-xs font-light'>
                        {loginTime == '-'
                          ? ''
                          : loginTime?.toLowerCase().includes('pm')
                          ? 'PM'
                          : 'AM'}
                      </span>
                    </div>
                    <div className='w-[5rem] md:w-28 max-w-full rounded-md shadow-md font-semibold'>
                      Login
                    </div>
                  </div>
                  <div>
                    <div
                      className={`bg-slate-600 flex justify-center items-center w-[5rem] md:w-28 max-w-full text-center rounded-md shadow-md text-xl font-bold py-3 px-2 `}
                    >
                      {logoutTime?.toLowerCase().includes('pm')
                        ? logoutTime.slice(0, logoutTime.length - 3)
                        : logoutTime.toLowerCase().includes('am')
                        ? logoutTime.slice(0, logoutTime.length - 3)
                        : logoutTime}
                      <span className='ml-0.5 -mb-1.5 text-xs font-light'>
                        {logoutTime == '-'
                          ? ''
                          : logoutTime?.toLowerCase().includes('pm')
                          ? 'PM'
                          : 'AM'}
                      </span>
                    </div>
                    <div className='w-[5rem] md:w-28 max-w-full rounded-md shadow-md font-semibold'>
                      Logout
                    </div>
                  </div>
                  <div>
                    <div
                      className={`bg-slate-600 w-[5rem] md:w-28 max-w-full text-center rounded-md shadow-md text-xl font-bold py-3 px-2 `}
                    >
                      {obj?.hours || '-'}
                    </div>
                    <div className='w-[5rem] md:w-28 max-w-full rounded-md shadow-md font-semibold'>
                      Time
                    </div>
                  </div>
                </div>
                {/* For IMP Note */}
                {obj.remark && (
                  <p className='ml-1 -mb-0.5 flex text-sm font-semibold items-center justify-center text-balance capitalize'>
                    Remark :
                    <span className='text-yellow-400 ml-1'> {obj.remark}</span>
                  </p>
                )}

                {/* For Holidays */}
                {isHoliday && (
                  <p className='ml-1 -mb-0.5 flex text-sm font-semibold items-center justify-center text-balance capitalize'>
                    Remark :
                    <span className='text-yellow-400 ml-1'> Holiday</span>
                  </p>
                )}
              </div>
            </section>
          );
        })}
      {isDeleteOpen && (
        <DeleteModal
          isOpen={isDeleteOpen}
          setIsOpen={setIsDeleteOpen}
        />
      )}
      {isEditOpen && (
        <EditModal
          isOpen={isEditOpen}
          setIsOpen={setIsEditOpen}
        />
      )}
    </main>
  );
}
