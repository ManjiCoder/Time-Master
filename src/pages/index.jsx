import { Baloo_Bhai_2 } from 'next/font/google';
import ToogleBtn from '@/components/HeadlessUI/ToggleBtn';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { format } from 'date-fns';
import { setLogin } from '@/redux/slices/attendanceSlice';
import CurrentTimeSpent from '@/components/CurrentTimeSpent';
import {
  calculateTimeSpent,
  isLoginTime,
  removeAMorPM,
} from '@/utils/dateService';
import TimeSpentIndicator from '@/components/TimeSpentIndicator';
import ToggleCheckBox from '@/components/ToggleCheckBox';

const inter = Baloo_Bhai_2({ subsets: ['latin'] });

export default function Home() {
  const { isOfficeMode, isShowAmt } = useSelector(
    (state) => state.userSettings
  );
  const attendance = useSelector((state) => state.attendance);
  const currentDate = new Date().setHours(0, 0, 0, 0);
  const year = new Date().getFullYear();
  const month = format(currentDate, 'MMMM');

  const isLogin = isLoginTime(year, month, currentDate, attendance);
  const [loginTime, setLoginTime] = useState(
    isLogin ? removeAMorPM(isLogin) : ''
  );
  const [logoutTime, setLogoutTime] = useState('');
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    const currentDate = new Date();
    const year = format(currentDate, 'yyyy');
    const month = format(currentDate, 'MMMM');
    const date = currentDate.setHours(0, 0, 0, 0);
    let timeSpendPayload = calculateTimeSpent(
      loginTime,
      isOfficeMode ? format(new Date(), 'HH:mm') : logoutTime
    );
    const payload = {
      date: currentDate.toISOString(),
      login: loginTime,
      logout: logoutTime,
      hours: `${timeSpendPayload.hrs
        .toString()
        .padStart(2, '0')}:${timeSpendPayload.mins
        .toString()
        .padStart(2, '0')}`,
      // logout: isOfficeMode ? format(new Date(), "HH:mm") : logoutTime,
    };
    if (loginTime.trim().length !== 0 && logoutTime.trim().length !== 0) {
      // alert(JSON.stringify({ loginTime, logoutTime }));
      dispatch(
        setLogin({
          year: year,
          month,
          date,
          [date]: payload,
        })
      );
      router.push('/attendance');
    }
  };
  return (
    // <PersistGate loading={null} persistor={persistor}>
    <main
      className={`bg-slate-300 dark:bg-slate-900 dark:text-white text-slate-800 min-h-screen pb-10 ${inter.className}`}
    >
      <TimeSpentIndicator
        isYearMonthPickerVisible={false}
        extraStyle={!isShowAmt ? 'text-xl' : 'text-lg'}
      />
      <div className="p-4">
        <section className="flex justify-between items-center">
          <h3 className="text-xl font-medium">Welcome </h3>
          {/* ToggleBtn */}
          <ToogleBtn />
        </section>

        <form
          className="grid grid-cols-2 my-5 gap-3 justify-evenly items-center"
          onSubmit={handleSubmit}
        >
          <div className="time inline-flex flex-col justify-center items-center gap-2 p-4 rounded-md shadow-md bg-slate-200 dark:bg-slate-800">
            <input
              className="outline-none focus-within:ring-2 rounded-md shadow-md px-1 py-2 dark:bg-slate-700"
              type="time"
              name="login"
              id="login"
              // step={300}
              // pattern="(?:1[012]|0[0-9]):[0-5][0-9] (?:AM|PM)"
              onChange={(e) => setLoginTime(e.target.value)}
              placeholder="hh:mm AM/PM"
              value={loginTime}
            />
            <h4 className="text-lg font-medium">Log-In</h4>
          </div>
          <div className="time inline-flex flex-col justify-center items-center gap-2 p-4 rounded-md shadow-md bg-slate-200 dark:bg-slate-800">
            <input
              className="outline-none focus-within:ring-2 rounded-md shadow-md px-1 py-2 dark:bg-slate-700"
              type="time"
              name="logout"
              id="logout"
              onChange={(e) => setLogoutTime(e.target.value)}
              placeholder="hh:mm AM/PM"
              value={logoutTime}
            />
            <h4 className="text-lg font-medium">Log-Out</h4>
          </div>
          <div className="pl-3 col-span-2 flex items-center text-sm">
            <ToggleCheckBox />
          </div>
          <button
            type="submit"
            className="col-span-2 mx-auto bg-slate-700 px-4 py-2 rounded-md shadow-md text-white"
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
