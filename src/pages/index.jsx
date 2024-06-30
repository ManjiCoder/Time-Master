import CurrentTimeSpent from '@/components/CurrentTimeSpent';
import ToogleBtn from '@/components/HeadlessUI/ToggleBtn';
import ListBoxMonths from '@/components/ListBoxMonths';
import ListBoxYears from '@/components/ListBoxYears';
import TimeSpentIndicator from '@/components/TimeSpentIndicator';
import ToggleCheckBox from '@/components/ToggleCheckBox';
import { setIsOfficeMode } from '@/redux/slices/UserSettings';
import { setLogin } from '@/redux/slices/attendanceSlice';
import {
  calculateTimeSpent,
  format24To12,
  isLoginTime,
  isLogoutTime,
  removeAMorPM,
} from '@/utils/dateService';
import { format } from 'date-fns';
import { Baloo_Bhai_2 } from 'next/font/google';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const inter = Baloo_Bhai_2({ subsets: ['latin'] });

export default function Home() {
  const { isOfficeMode, userName } = useSelector((state) => state.userSettings);
  const { isShowAmt } = useSelector((state) => state.dateSlice);
  const attendance = useSelector((state) => state.attendance);
  const currentDate = new Date().setHours(0, 0, 0, 0);
  const year = new Date().getFullYear();
  const month = format(currentDate, 'MMMM');
  const years = Object.keys(attendance)
    .filter((v) => v !== 'undefined')
    .reverse();

  const isLogin = isLoginTime(year, month, currentDate, attendance);
  const isLogout = isLogoutTime(year, month, currentDate, attendance);
  const [loginTime, setLoginTime] = useState(
    isLogin ? removeAMorPM(isLogin) : ''
  );
  const [logoutTime, setLogoutTime] = useState(
    isLogout ? removeAMorPM(isLogout) : ''
  );
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    // if (isValidTime(loginTime, logoutTime)) {
    //   dispatch(setIsOfficeMode(false));
    //   return toast.warn('Invalid Time');
    // }
    const currentDate = new Date();
    const year = format(currentDate, 'yyyy');
    const month = format(currentDate, 'MMMM');
    const date = currentDate.setHours(0, 0, 0, 0);
    let timeSpendPayload = calculateTimeSpent(
      loginTime,
      isOfficeMode ? format(new Date(), 'HH:mm') : logoutTime
    );

    const isTodayData = (() => {
      try {
        return attendance[year][month][date];
      } catch (error) {
        return {};
      }
    })();
    // console.log(isTodayData);

    const payload = {
      date: format(date, 'yyyy-MM-dd'),
      login: format24To12(loginTime),
      logout: format24To12(logoutTime),
      hours: `${timeSpendPayload.hrs
        .toString()
        .padStart(2, '0')}:${timeSpendPayload.mins
        .toString()
        .padStart(2, '0')}`,
      present: '1',
      // logout: isOfficeMode ? format(new Date(), "HH:mm") : logoutTime,
    };
    if (loginTime.trim().length !== 0 && logoutTime.trim().length !== 0) {
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
      router.push('/attendance');
    }
  };
  return (
    // <PersistGate loading={null} persistor={persistor}>
    <main
      className={`min-h-screen bg-slate-300 pb-10 text-slate-800 dark:bg-slate-900 dark:text-white ${inter.className}`}
    >
      <TimeSpentIndicator isYearMonthPickerVisible={false} />
      <div className='p-4'>
        <section className='flex items-center justify-between'>
          <h3 className='text-xl font-medium'>Welcome, {userName} </h3>
          {/* ToggleBtn */}
          <ToogleBtn loginTime={loginTime} />
        </section>

        <form
          className='my-5 grid grid-cols-2 items-center justify-evenly gap-3'
          onSubmit={handleSubmit}
        >
          <div className='time inline-flex flex-col items-center justify-center gap-2 rounded-md bg-slate-200 p-4 shadow-md dark:bg-slate-800'>
            <input
              className='rounded-md px-1 py-2 shadow-md outline-none focus-within:ring-2 dark:bg-slate-700 max-xs:w-28'
              // className={`outline-none focus-within:ring-2 rounded-md shadow-md px-1 py-2 dark:bg-slate-700 max-xs:w-28 ${
              //   !isOfficeMode &&
              //   isValidTime(loginTime, logoutTime) &&
              //   'ring-2 ring-red-500'
              // }`}
              type='time'
              name='login'
              id='login'
              onChange={(e) => {
                setLoginTime(e.target.value);
                // if (isValidTime(e.target.value, logoutTime)) {
                //   dispatch(setIsOfficeMode(false));
                //   toast.warn('Invalid Time');
                // }
              }}
              placeholder='hh:mm AM/PM'
              value={loginTime}
            />
            <button
              type='button'
              onClick={() => {
                setLoginTime(format(new Date(), 'HH:mm'));
                setLogoutTime('');
                dispatch(setIsOfficeMode(true));
              }}
              className={`w-28 rounded-md py-1.5 text-center text-lg font-medium text-white shadow-md hover:bg-slate-800 hover:dark:bg-slate-900 ${
                isOfficeMode ? 'bg-slate-800 dark:bg-slate-900' : 'bg-slate-700'
              }`}
            >
              Log-In
            </button>
          </div>
          <div className='time inline-flex flex-col items-center justify-center gap-2 rounded-md bg-slate-200 p-4 shadow-md dark:bg-slate-800'>
            <input
              className='rounded-md px-1 py-2 shadow-md outline-none focus-within:ring-2 dark:bg-slate-700 max-xs:w-28'
              type='time'
              name='logout'
              id='logout'
              onChange={(e) => {
                setLogoutTime(e.target.value);
                // if (isValidTime(loginTime, e.target.value)) {
                //   dispatch(setIsOfficeMode(false));
                //   toast.warn('Invalid Time');
                // }
              }}
              placeholder='hh:mm AM/PM'
              value={logoutTime}
            />
            <button
              type='button'
              onClick={() => {
                setLogoutTime(format(new Date(), 'HH:mm'));
                dispatch(setIsOfficeMode(false));
              }}
              className={`w-28 rounded-md py-1.5 text-center text-lg font-medium text-white shadow-md hover:bg-slate-800 hover:dark:bg-slate-900 ${
                !isOfficeMode
                  ? 'bg-slate-800 dark:bg-slate-900'
                  : 'bg-slate-700'
              }`}
            >
              Log-Out
            </button>
          </div>
          <section className='col-span-2 flex items-center justify-between px-3 text-sm'>
            <ToggleCheckBox />
            <div className='flex space-x-2 text-center'>
              <ListBoxYears years={years} />
              <ListBoxMonths />
            </div>
          </section>
          <button
            type='submit'
            className='col-span-2 mx-auto rounded-md bg-slate-700 px-4 py-2 text-white shadow-md'
          >
            Submit
          </button>
        </form>

        {/* Office Mode */}

        {isOfficeMode && (
          <CurrentTimeSpent
            loginTime={loginTime.trim()}
            logoutTime={logoutTime.trim()}
          />
        )}
        {/* OnSubmit Mode */}

        {loginTime.trim().length !== 0 &&
          logoutTime.trim().length !== 0 &&
          !isOfficeMode && (
            <CurrentTimeSpent
              loginTime={loginTime.trim()}
              logoutTime={logoutTime.trim()}
            />
          )}

        {/* Results */}
      </div>
    </main>
    // </PersistGate>
  );
}
