import {
  filterObj,
  filterOptions,
  setSortBy,
} from '@/redux/slices/UserSettings';
import { Listbox, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function ListBoxFilter() {
  const years = filterOptions;
  const { sortBy: selected } = useSelector((state) => state.userSettings);
  const dispatch = useDispatch();

  return (
    <div className=''>
      <Listbox value={selected} onChange={(e) => dispatch(setSortBy(e))}>
        <div className='relative text-sm max-ss:text-xs'>
          <Listbox.Button className='relative flex w-full cursor-pointer items-center space-x-2 rounded-lg rounded-r-none bg-slate-50 py-2 pl-3 pr-1.5 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 dark:bg-slate-700 sm:text-sm'>
            <span className='block truncate font-semibold text-gray-900 dark:text-white'>
              {selected || filterObj.date}
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave='transition ease-in duration-100'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <Listbox.Options className='absolute z-10 mt-1 max-h-60 w-full min-w-20 overflow-auto rounded-md bg-white py-1 text-center text-sm shadow-lg ring-1 ring-black/5 focus:outline-none dark:bg-slate-700 dark:text-white sm:text-sm'>
              {years.map((year, yearsIdx) => (
                <Listbox.Option
                  key={yearsIdx}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 ${
                      selected === year
                        ? 'bg-slate-200 dark:bg-slate-600'
                        : 'text-gray-900 dark:text-white'
                    }`
                  }
                  value={year}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? 'font-medium' : 'font-normal'
                        }`}
                      >
                        {year}
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
