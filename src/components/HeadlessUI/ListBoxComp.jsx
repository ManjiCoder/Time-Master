import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { remarkObj } from '../EditModal';

export default function ListBoxComp(props) {
  const options = Object.values(remarkObj);
  const {
    note: selected,
    loginTime,
    logoutTime,
    hoursTime,
    setNote: setSelected,
    setIsLeave,
    setLoginTime,
    setLogoutTime,
    setHoursTime,
    setOtherNote,
  } = props;
  return (
    <div className='w-36'>
      <Listbox
        value={selected}
        onChange={(e) => {
          setSelected(e);
          if (
            [
              remarkObj.leave,
              remarkObj.floatingLeave,
              remarkObj.workFromHome,
            ].includes(e)
          ) {
            setIsLeave(e !== remarkObj.workFromHome);
            setLoginTime('09:00');
            setLogoutTime('18:00');
            setHoursTime('09:00');
            setOtherNote('');
          } else {
            setIsLeave(!true);
            setLoginTime(loginTime);
            setLogoutTime(logoutTime);
            setHoursTime(hoursTime);
          }
        }}
      >
        <div className='relative text-sm w-full'>
          <Listbox.Button className='relative w-full cursor-default rounded-lg bg-white dark:bg-slate-700 py-2.5 pl-3 pr-6 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm h-10'>
            <span className='block capitalize truncate text-gray-900 dark:text-white text-base'>
              {selected.includes('Others') ? 'Others' : selected}
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
            <Listbox.Options className='absolute text-sm mt-1 max-h-60 w-full min-w-24 right-0 overflow-auto rounded-md bg-white dark:bg-slate-700 py-1 shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm'>
              {options.map((month, monthIdx) => (
                <Listbox.Option
                  key={monthIdx}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-3 capitalize ${
                      active
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
