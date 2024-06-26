import { setYear } from '@/redux/slices/dateSlice';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// const years = [2024, 2023];

export default function ListBoxYears() {
  const { year: selected } = useSelector((state) => state.dateSlice);
  const attendance = useSelector((state) => state.attendance);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const years = isClient
    ? Object.keys(attendance)
        .filter((v) => v !== 'undefined')
        .toSorted()
        .toReversed()
    : [];
  const dispatch = useDispatch();

  return (
    <div className=''>
      <Listbox value={selected} onChange={(e) => dispatch(setYear(e))}>
        <div className='relative text-sm max-ss:text-xs'>
          <Listbox.Button className='relative w-full cursor-pointer rounded-lg bg-white py-1.5 pl-3 pr-8 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 dark:bg-slate-700 sm:text-sm'>
            <span className='block truncate font-semibold text-gray-900 dark:text-white'>
              {selected}
            </span>
            <span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
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
            <Listbox.Options
              className={`absolute right-0 z-10 mt-1 max-h-60 w-full min-w-24 overflow-auto rounded-md bg-white ${years.length > 1 && 'py-1'} text-sm shadow-lg ring-1 ring-black/5 focus:outline-none dark:bg-slate-700 sm:text-sm`}
            >
              {years.map((year, yearsIdx) => (
                <Listbox.Option
                  key={yearsIdx}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 ${
                      selected == year || active
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
