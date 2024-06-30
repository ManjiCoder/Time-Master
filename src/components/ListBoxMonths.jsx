import { setMonth } from '@/redux/slices/dateSlice';
import { monthNameToIndex } from '@/utils/dateService';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { Fragment, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
export default function ListBoxMonths() {
  const { month, year } = useSelector((state) => state.dateSlice);
  const dispatch = useDispatch();
  const [selected, setSelected] = useState(month);
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthsToShow = Object.keys(monthNameToIndex).filter((_v, i) =>
    currentYear == year ? currentMonth >= i : _v
  );

  return (
    <div className=''>
      <Listbox
        value={selected}
        onChange={(e) => {
          setSelected(e);
          dispatch(setMonth(e));
        }}
      >
        <div className='relative text-sm max-ss:text-xs'>
          <Listbox.Button className='relative w-full cursor-pointer rounded-lg bg-white py-1.5 pl-3 pr-6 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 dark:bg-slate-700 sm:text-sm'>
            <span className='block truncate font-semibold text-gray-900 dark:text-white'>
              {selected}
            </span>
            <span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-1'>
              <ChevronDownIcon
                className='h-5 w-5 text-gray-400 dark:text-slate-400'
                aria-hidden='true'
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave='transition ease-in duration-100'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <Listbox.Options className='absolute right-0 z-10 mt-1 max-h-60 w-full min-w-24 overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black/5 focus:outline-none dark:bg-slate-700 sm:text-sm'>
              {monthsToShow.map((month, monthIdx) => (
                <Listbox.Option
                  key={monthIdx}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 ${
                      selected === month
                        ? 'bg-slate-200 dark:bg-slate-600'
                        : 'text-gray-900 dark:text-white'
                    }`
                  }
                  value={month}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? 'font-medium' : 'font-normal'
                        }`}
                      >
                        {month}
                      </span>
                      {selected ? (
                        <span className='absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600'>
                          {/* <CheckIcon className="h-5 w-5" aria-hidden="true" /> */}
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}
