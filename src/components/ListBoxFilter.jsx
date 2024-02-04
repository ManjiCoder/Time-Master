import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { useDispatch, useSelector } from 'react-redux';
import { filterObj, setSortBy } from '@/redux/slices/UserSettings';

export default function ListBoxFilter() {
  const years = Object.values(filterObj);
  const { sortBy: selected } = useSelector((state) => state.userSettings);
  const dispatch = useDispatch();

  return (
    <div className=''>
      <Listbox
        value={selected}
        onChange={(e) => dispatch(setSortBy(e))}
      >
        <div className='relative text-sm'>
          <Listbox.Button className='relative w-full cursor-default rounded-lg bg-white dark:bg-slate-700 py-1.5 pl-3 pr-8 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm'>
            <span className='block truncate dark:text-white text-gray-900 font-semibold'>
              {selected}
            </span>
            <span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
              <ChevronUpDownIcon
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
            <Listbox.Options className='absolute z-10 text-center dark:text-white text-sm mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-slate-700 py-1 shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm'>
              {years.map((year, yearsIdx) => (
                <Listbox.Option
                  key={yearsIdx}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2   ${
                      active
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
