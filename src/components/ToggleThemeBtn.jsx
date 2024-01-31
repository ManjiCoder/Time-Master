import { Menu, Transition } from '@headlessui/react';
import { Fragment, useEffect } from 'react';
import {
  ChevronDownIcon,
  ComputerDesktopIcon,
  MoonIcon,
  SunIcon,
} from '@heroicons/react/20/solid';
import { useTheme } from 'next-themes';
import { useDispatch, useSelector } from 'react-redux';
import { updateTheme } from '@/redux/slices/UserSettings';

const ThemeModes = {
  system: 'system',
  dark: 'dark',
  light: 'light',
};
export default function Example() {
  const { theme: userTheme } = useSelector((state) => state.userSettings);
  const dispatch = useDispatch();

  const { systemTheme, theme, setTheme } = useTheme();
  //   const currentTheme = theme === 'system' ? systemTheme : theme;

  useEffect(() => {
    dispatch(updateTheme(theme));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTheme = (mode) => {
    dispatch(updateTheme(mode));
    setTheme(mode);
  };
  return (
    <div className='ml-2'>
      <Menu as='div' className='relative inline-block text-left'>
        <div>
          <Menu.Button className='inline-flex w-full justify-center rounded-md bg-slate-100 dark:bg-black/20 px-4 py-2 text-sm font-medium dark:text-white hover:bg-slate-50 dark:hover:bg-black/30 capitalize focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75'>
            {userTheme === ThemeModes.system ? (
              <ComputerDesktopIcon
                className='mr-2 h-5 w-5'
                aria-hidden='true'
              />
            ) : userTheme === ThemeModes.dark ? (
              <MoonIcon className='mr-2 h-5 w-5' aria-hidden='true' />
            ) : (
              <SunIcon className='mr-2 h-5 w-5' aria-hidden='true' />
            )}
            {userTheme}
            <ChevronDownIcon
              className='-mr-1 ml-2 h-5 w-5'
              aria-hidden='true'
            />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter='transition ease-out duration-100'
          enterFrom='transform opacity-0 scale-95'
          enterTo='transform opacity-100 scale-100'
          leave='transition ease-in duration-75'
          leaveFrom='transform opacity-100 scale-100'
          leaveTo='transform opacity-0 scale-95'
        >
          <Menu.Items className='absolute right-0 t-2 w-24 origin-top-right divide-y divide-gray-100 rounded-md dark:bg-slate-800 bg-white shadow-lg ring-1 ring-black/5 focus:outline-none'>
            <div className='px-1 py-1'>
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? 'bg-violet-500 text-white' : 'text-gray-900'
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm dark:text-white`}
                    onClick={() => handleTheme(ThemeModes.system)}
                  >
                    {active ? (
                      <ComputerDesktopIcon
                        className='mr-2 h-5 w-5'
                        aria-hidden='true'
                      />
                    ) : (
                      <ComputerDesktopIcon
                        className='mr-2 h-5 w-5'
                        aria-hidden='true'
                      />
                    )}
                    System
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? 'bg-violet-500 text-white' : 'text-gray-900'
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm dark:text-white`}
                    onClick={() => handleTheme(ThemeModes.dark)}
                  >
                    {active ? (
                      <MoonIcon className='mr-2 h-5 w-5' aria-hidden='true' />
                    ) : (
                      <MoonIcon className='mr-2 h-5 w-5' aria-hidden='true' />
                    )}
                    Dark
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? 'bg-violet-500 text-white' : 'text-gray-900'
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm dark:text-white`}
                    onClick={() => handleTheme(ThemeModes.light)}
                  >
                    {active ? (
                      <SunIcon className='mr-2 h-5 w-5' aria-hidden='true' />
                    ) : (
                      <SunIcon className='mr-2 h-5 w-5' aria-hidden='true' />
                    )}
                    Light
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}
