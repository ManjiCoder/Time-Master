import { Baloo_Bhai_2 } from 'next/font/google';
import TimeSpentIndicator from '@/components/TimeSpentIndicator';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { format, getDate, isSaturday, isSunday } from 'date-fns';
import {
  ArrowDownCircleIcon,
  ArrowUpCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PencilSquareIcon,
  TrashIcon,
} from '@heroicons/react/20/solid';
import { setTargetDate } from '@/redux/slices/dateSlice';
import {
  calculateTimeSpent,
  format24To12,
  formattedTime12,
  isHolidays,
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
import { useTheme } from 'next-themes';
import Remark from '@/components/Remark';

const inter = Baloo_Bhai_2({ subsets: ['latin'] });

// Holidays List
export const holidays = {
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

const initial = {
  1706207400000: { date: '26-Jan-2024', desc: 'Republic Days' },
  1711305000000: { date: '25-Mar-2024', desc: 'Holi' },
  1712773800000: { date: '11-Apr-2024', desc: 'Ramzan Eid' },
  1714501800000: { date: '01-May-2024', desc: 'Maharashtra Day' },
  1723660200000: { date: '15-Aug-2024', desc: 'Independence Day' },
  1725647400000: { date: '07-Sep-2024', desc: 'Ganesh Chaturthi' },
  1727807400000: { date: '02-Oct-2024', desc: 'Mahatma Gandhi Jayanti' },
  1728671400000: { date: '12-Oct-2024', desc: 'Dussehra' },
  1730399400000: { date: '01-Nov-2024', desc: 'Diwali' },
  1735065000000: { date: '25-Dec-2024', desc: 'Christmas' },
};
export const holidayDetails = initial;

export default function Attendance() {
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDark = currentTheme === 'dark';

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
    try {
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
              date: format(date, 'yyyy-MM-dd'),
              login: format24To12(login),
              logout: format24To12(logout),
              hours: `${timeSpendPayload.hrs
                .toString()
                .padStart(2, '0')}:${timeSpendPayload.mins
                .toString()
                .padStart(2, '0')}`,
              present: '1',
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
    } catch (error) {}
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

  let showDates = Object.keys(attendance[year][month]);
  if (sortBy === filterObj.holidays) {
    const holidays = Object.keys(attendance[year][month]).filter((v) => {
      const parseDate = new Date(parseInt(v));
      const dayNum = getDate(parseDate);
      const isHoliday = isHolidays(parseDate, dayNum);
      return isHoliday;
    });
    showDates = holidays;
  } else if (sortBy === filterObj.today) {
    const tillTodayDates = Object.keys(attendance[year][month]).filter(
      (v) => v <= new Date().setHours(0, 0, 0, 0)
    );
    showDates = tillTodayDates;
  } else if (sortBy === filterObj.present) {
    const presentDays = Object.keys(attendance[year][month]).filter((v) => {
      return attendance[year][month][v].present === '1';
    });
    showDates = presentDays;
  } else if (sortBy === filterObj.absent) {
    const absentDays = Object.keys(attendance[year][month]).filter((v) => {
      const parseDate = new Date(parseInt(v));
      const dayNum = getDate(parseDate);
      const isHoliday = isHolidays(parseDate, dayNum);
      const isLeave = attendance[year][month][v].leave === '1';
      const isPresent = ['0.5', '1'].includes(
        attendance[year][month][v].present
      );
      return !isHoliday && !isLeave && !isPresent;
    });
    showDates = absentDays;
  }
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
      <section className='flex font-semibold justify-between mx-2 mt-2 items-center dark:text-white'>
        {/* <span>Sort By Date : </span> */}
        <div className='flex items-center'>
          <ToogleBtn />
          {data && !Object.values(data).includes(NaN) && (
            <>
              <p className='flex flex-col items-center justify-center text-center'>
                <span className='font-semibold text-[18px] w-16'>
                  {data.hrs > 0 && data.hrs + ':'}
                  {data.mins.toString().padStart(2, '0')}:
                  {data.secs.toString().padStart(2, '0')}
                </span>
                <span className='text-[0.57rem] -mt-1.5'>Time Spend</span>
              </p>
              <p
                className={`ml-2 relative font-semibold flex items-center justify-center text-white text-lg ${
                  Math.floor(data.percent) > 100 ? 'w-16' : 'w-14'
                } rounded-md shadow-sm text-center from-slate-700`}
                style={{
                  background: `linear-gradient(90deg, #16a34a ${Math.floor(
                    data.percent
                  )}% , ${
                    isDark
                      ? isOfficeMode
                        ? '#334155'
                        : '#475569'
                      : isOfficeMode
                      ? '#0f172a'
                      : '#475569'
                  } ${Math.floor(data.percent)}%)`,
                }}
              >
                {Math.floor(data.percent)}
                <span className='text-sm'>%</span>
                <span
                  className={`absolute -right-1 w-1 h-2 ${
                    isOfficeMode ? 'bg-slate-900' : 'bg-slate-600'
                  } ${
                    isOfficeMode ? 'dark:bg-slate-700' : 'bg-slate-600'
                  } rounded-r-sm`}
                ></span>
              </p>
            </>
          )}
        </div>

        <div className='flex'>
          <ListBoxFilter />
          <div className='flex pr-2 flex-col justify-center items-center rounded-lg rounded-l-none bg-slate-50 dark:bg-slate-700'>
            <ChevronUpIcon
              className={`w-5 -mb-2.5 cursor-pointer ${
                order === filterOrder.ascending
                  ? 'text-gray-700 dark:text-white'
                  : 'text-gray-400 dark:text-slate-400'
              } `}
              onClick={() => dispatch(setSortByOrder(filterOrder.ascending))}
            />
            <ChevronDownIcon
              className={`w-5 cursor-pointer ${
                order === filterOrder.descending
                  ? 'text-gray-700 dark:text-white'
                  : 'text-gray-400 dark:text-slate-400'
              } `}
              onClick={() => dispatch(setSortByOrder(filterOrder.descending))}
            />
          </div>
        </div>
      </section>

      {showDates.length === 0 && (
        <h2 className='text-xl text-center dark:text-white mt-5'>
          No Data Found!
        </h2>
      )}

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
          const obj = attendance[year][month][date];
          const parseDate = new Date(parseInt(date));
          const day = format(parseDate, 'EEEE');
          const dayNum = getDate(parseDate);
          const isHoliday = isHolidays(parseDate, dayNum);
          const isLeave = obj.leave === '1';
          const isAbsent =
            date <= currentDate.setHours(0, 0, 0, 0) &&
            !isHoliday &&
            !isLeave &&
            obj.present !== '1';

          let remark =
            obj?.remark ||
            (obj?.leave === '1' && 'Leave') ||
            (obj?.present === '0.5' && 'Half Day') ||
            (isAbsent && 'Absent') ||
            null;

          if (isHoliday) {
            if (obj.remark) {
              remark =
                obj.remark !== '' ? `Holiday - ${obj.remark}` : 'Holiday';
            } else {
              if (holidayDetails[parseInt(date)]) {
                remark = holidayDetails[parseInt(date)].desc;
              } else {
                remark = 'Holiday';
              }
            }
          }
          if (
            date === currentDate.setHours(0, 0, 0, 0).toString() &&
            isOfficeMode
          ) {
            remark = "You're in the Office";
          }
          // console.log(obj)
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
                    isAbsent && 'text-red-500'
                  } ${isLeave && 'text-pink-500'} ${
                    isHoliday && 'dark:text-green-600 text-green-600/85'
                  }`}
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
                <Remark msg={remark} />
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
