import AttendanceItems from '@/components/AttendanceItems';
import DeleteModal from '@/components/DeleteModal';
import EditModal from '@/components/EditModal';
import ExtraTimePerDay from '@/components/ExtraTimePerDay';
import ToogleBtn from '@/components/HeadlessUI/ToggleBtn';
import ListBoxFilter from '@/components/ListBoxFilter';
import ScrollToTopBtn from '@/components/ScrollToTopBtn';
import TimeSpentIndicator from '@/components/TimeSpentIndicator';
import {
  filterObj,
  filterOrder,
  setSortByOrder,
} from '@/redux/slices/UserSettings';
import { setCurrentTimeSpent } from '@/redux/slices/attendanceSlice';
import {
  calculateTimeSpent,
  format24To12,
  isHolidays,
  removeAMorPM,
} from '@/utils/dateService';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid';
import { format, getDate } from 'date-fns';
import { useTheme } from 'next-themes';
import { Baloo_Bhai_2 } from 'next/font/google';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const inter = Baloo_Bhai_2({ subsets: ['latin'] });

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
      const isPastDate = v <= new Date().setHours(0, 0, 0, 0);
      return isPastDate && !isHoliday && !isLeave && !isPresent;
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
      className={`bg-slate-300 dark:bg-slate-900 text-slate-800 min-h-screen pb-20 ${inter.className}`}
    >
      <TimeSpentIndicator />
      <section className='flex font-semibold justify-between mx-2 mt-2 items-center dark:text-white'>
        {/* <span>Sort By Date : </span> */}
        <div className='flex items-center'>
          <ToogleBtn />
          {data && !Object.values(data).includes(NaN) && (
            <>
              <p className='flex flex-col items-center justify-center text-center'>
                <span className='font-bold text-[18px] w-16'>
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
          <ExtraTimePerDay />
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

      <AttendanceItems
        showDates={showDates}
        isEditOpen={isEditOpen}
        setIsEditOpen={setIsEditOpen}
        isDeleteOpen={isDeleteOpen}
        setIsDeleteOpen={setIsDeleteOpen}
      />

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
      <ScrollToTopBtn />
    </main>
  );
}
