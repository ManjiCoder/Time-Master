import { Fragment, useEffect, useRef } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { remarkObj } from '../EditModal';

export default function ListBoxComp(props) {
  const options = Object.values(remarkObj);
  const inputRef = useRef(null);
  const {
    note: selected,
    loginTime,
    logoutTime,
    hoursTime,
    setNote: setSelected,
    otherNote,
    setIsLeave,
    setLoginTime,
    setLogoutTime,
    setHoursTime,
    setOtherNote,
  } = props;

  const setFocus = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    setFocus();
  }, []);

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
          } else if (e === remarkObj.others) {
            setFocus();
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

        {selected === remarkObj.others && (
          <input
            className='outline-none mt-2 focus-within:ring-2 rounded-md shadow-md px-1 py-2 w-36 dark:bg-slate-700 pl-3 capitalize'
            type='search'
            onChange={(e) => setOtherNote(e.target.value)}
            placeholder='Remark'
            maxLength={100}
            value={otherNote}
            ref={inputRef}
          />
        )}
      </Listbox>
    </div>
  );
}
