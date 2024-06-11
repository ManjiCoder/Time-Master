import { setIsOfficeMode, toggleOfficeMode } from '@/redux/slices/UserSettings';
import { Switch } from '@headlessui/react';
import { BriefcaseIcon, HomeIcon } from '@heroicons/react/20/solid';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

export default function ToogleBtn({ loginTime = '-' }) {
  const { isOfficeMode } = useSelector((state) => state.userSettings);
  const attendance = useSelector((state) => state.attendance);
  const { month, year } = useSelector((state) => state.dateSlice);
  const dispatch = useDispatch();

  // Office Mode
  const handleOfficeMode = () => {
    const isTodayLogin = (() => {
      try {
        return (
          attendance[year][month][new Date().setHours(0, 0, 0, 0).toString()]
            .login !== '-' || !['', '-'].includes(loginTime)
        );
      } catch (error) {
        return !['', '-'].includes(loginTime);
      }
    })();

    if (isTodayLogin) {
      dispatch(toggleOfficeMode());
    } else {
      toast.warn('Please Login First!');
      dispatch(setIsOfficeMode(false));
    }
  };

  return (
    <div className='flex items-center'>
      <Switch
        checked={isOfficeMode}
        onChange={handleOfficeMode}
        className={`${
          isOfficeMode ? 'bg-slate-800 dark:bg-slate-700' : 'bg-slate-600'
        } relative inline-flex h-[38px] w-[74px] shrink-0 scale-[0.8] cursor-pointer items-center justify-between rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75`}
      >
        {isOfficeMode && (
          <span
            className={`absolute ml-1.5 w-5 text-[7px] capitalize text-white ${
              isOfficeMode ? 'grid place-items-center' : 'hidden'
            }`}
          >
            <BriefcaseIcon />
            Office
          </span>
        )}
        <span className='sr-only'>Use setting</span>

        <span
          aria-hidden='true'
          className={`${isOfficeMode ? 'translate-x-9' : 'translate-x-0'} pointer-events-none inline-block h-[34px] w-[34px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
        />

        {!isOfficeMode && (
          <span
            className={`mr-1.5 mt-2.5 w-5 animate-bounce text-[7px] capitalize text-white ${
              !isOfficeMode ? 'grid place-items-center' : 'hidden'
            }`}
          >
            <HomeIcon />
            Home
          </span>
        )}
      </Switch>
    </div>
  );
}
