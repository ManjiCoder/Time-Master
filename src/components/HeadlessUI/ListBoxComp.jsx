import { remarkObj } from '@/utils/constants';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { Fragment, useEffect, useRef } from 'react';

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
    handleHalfDay,
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
    <div className='w-36 max-xs:w-28 max-ss:w-24'>
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
            setIsLeave(false);
            setTimeout(() => {
              setFocus();
            }, 150);
          } else if (e === remarkObj.halfDayLeave) {
            handleHalfDay();
          } else {
            setIsLeave(false);
            setLoginTime(loginTime);
            setLogoutTime(logoutTime);
            setHoursTime(hoursTime);
          }
        }}
      >
        <div className='relative w-full text-sm'>
          <Listbox.Button className='relative h-10 w-full cursor-default rounded-lg bg-white py-2.5 pl-3 pr-6 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 dark:bg-slate-700 sm:text-sm'>
            <span className='block truncate text-base capitalize text-gray-900 dark:text-white'>
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
            <Listbox.Options className='absolute right-0 mt-1 max-h-60 w-full min-w-36 overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black/5 focus:outline-none dark:bg-slate-700 sm:text-sm'>
              {options.map((month, monthIdx) => (
                <Listbox.Option
                  key={monthIdx}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 pl-3 capitalize ${
                      selected === month || active
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
            className='mt-2 w-36 rounded-md px-1 py-2 pl-3 capitalize shadow-md outline-none focus-within:ring-2 dark:bg-slate-700 max-xs:w-28 max-ss:w-24'
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
