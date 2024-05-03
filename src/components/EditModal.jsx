import { editByDate } from '@/redux/slices/attendanceSlice';
import {
  calculateTimeSpent,
  format24To12,
  isHolidays,
  removeAMorPM,
} from '@/utils/dateService';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/20/solid';
import { format, getDate } from 'date-fns';
import { Fragment, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import ListBoxComp from './HeadlessUI/ListBoxComp';

export const remarkObj = {
  leave: 'Leave',
  floatingLeave: 'Floating Leave',
  workFromHome: 'Work From Home',
  others: 'Others',
};

export default function EditModal({ isOpen, setIsOpen }) {
  const attendance = useSelector((state) => state.attendance);
  const { year, month, targetDate } = useSelector((state) => state.dateSlice);
  const { isOfficeMode } = useSelector((state) => state.userSettings);
  const dispatch = useDispatch();
  const data = attendance[year][month][targetDate];
  const { login, logout, hours, leave, remark } = data;
  const [loginTime, setLoginTime] = useState(removeAMorPM(login));
  const [logoutTime, setLogoutTime] = useState(removeAMorPM(logout));
  const [hoursTime, setHoursTime] = useState(hours === '-' ? null : hours);
  const [isLeave, setIsLeave] = useState(leave === '1' || false);
  const [note, setNote] = useState(remark || (isLeave && 'Leave') || '');

  // TODO: Place inside utils file
  const getOtherRemark = (str) => {
    try {
      return str.includes('Others - ') ? str.replace('Others - ', '') : '';
    } catch (error) {
      return '';
    }
  };
  const otherRemark = getOtherRemark(remark);
  const [otherNote, setOtherNote] = useState(otherRemark);

  function closeModal() {
    setIsOpen(false);
  }

  const calculateTimeSpentInHrsMins = (login, logout) => {
    const diffObj = calculateTimeSpent(login, logout);
    const { hrs, mins } = diffObj;
    if (isNaN(hrs) || isNaN(mins)) return '-';
    return `${hrs.toString().padStart(2, '0')}:${mins
      .toString()
      .padStart(2, '0')}`;
  };

  const handleEdit = (e) => {
    e.preventDefault();

    const targetDateData = attendance[year][month][targetDate];
    const parseDate = new Date(parseInt(targetDate));
    const dayNum = getDate(parseDate);
    const isHoliday = isHolidays(parseDate, dayNum);
    const isTargetDateLeave = targetDateData.leave === '1';

    const editedData = {
      ...targetDateData,
      login: format24To12(loginTime),
      logout: format24To12(logoutTime),
      hours: hoursTime,
      present: loginTime.includes(':') && logoutTime.includes(':') ? '1' : '-',
    };

    if (isLeave || isTargetDateLeave) {
      editedData.present = '1';
      editedData.leave = '1';
      editedData.remark = note || 'Leave';
    }
    if (!isLeave) {
      delete editedData?.leave;
      delete editedData?.remark;
    }

    if (isOfficeMode && targetDate == new Date().setHours(0, 0, 0, 0)) {
      toast.warn('Disable Office Mode!');
      closeModal();
      return;
    }

    if (otherNote !== '' && note.includes(remarkObj.others)) {
      editedData.remark = `${remarkObj.others} - ${otherNote}`;
    } else if (otherNote === '' && note.includes(remarkObj.others)) {
      editedData.remark = remarkObj.others;
    } else if (note !== '') {
      editedData.remark = note;
    } else {
      delete editedData.remark;
    }

    const payload = {
      year,
      month,
      date: targetDate,
      data: editedData,
    };
    // console.table(payload.data);
    dispatch(editByDate(payload));
    closeModal();
    toast.success('TimeLog Updated Successfully!');
  };

  const handleReset = () => {
    const targetDateData = attendance[year][month][targetDate];
    setLoginTime('-');
    setLogoutTime('-');
    setHoursTime('');
    setIsLeave('');
    setNote('');
    const editedData = {
      ...targetDateData,
      login: '-',
      logout: '-',
      hours: '-',
      present: '-',
      leave: '-',
    };

    if (isOfficeMode && targetDate == new Date().setHours(0, 0, 0, 0)) {
      toast.warn('Disable Office Mode!');
      closeModal();
      return;
    }

    const payload = {
      year,
      month,
      date: targetDate,
      data: editedData,
    };
    dispatch(editByDate(payload));
  };

  const handleLeave = () => {
    setIsLeave(!isLeave);
    setLoginTime('09:00');
    setLogoutTime('18:00');
    setHoursTime('09:00');
    setNote(!isLeave ? 'Leave' : '');
  };

  return (
    <>
      <Transition appear show={true} as={Fragment}>
        <Dialog as='div' className='relative z-10' onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-black/70' />
          </Transition.Child>

          <div className='fixed inset-0 overflow-y-auto'>
            <div className='flex min-h-full items-center justify-center p-4 text-center'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 scale-95'
                enterTo='opacity-100 scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 scale-100'
                leaveTo='opacity-0 scale-95'
              >
                <Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-slate-900 p-6 text-left align-middle shadow-xl transition-all'>
                  <Dialog.Title
                    as='h3'
                    className='text-2xl font-medium text-center mb-3 leading-6 text-gray-900 dark:text-white'
                  >
                    Are you sure?
                  </Dialog.Title>
                  <button onClick={closeModal}>
                    <XMarkIcon className='absolute top-5 right-4 w-7 text-gray-900 dark:text-white text-xl' />
                  </button>
                  <h2 className='text-center font-medium mb-4 text-gray-900 dark:text-white'>
                    Do you want to edit the{' '}
                    {format(
                      attendance[year][month][targetDate].date,
                      'dd-MMM-yyyy'
                    )}{' '}
                    TimeLog?
                  </h2>

                  <form
                    className='grid grid-cols-2 text-gray-900 dark:text-white my-5 gap-4 justify-evenly items-center'
                    onSubmit={handleEdit}
                  >
                    <div className='time inline-flex flex-col justify-center items-center gap-2 p-4 rounded-md shadow-md bg-slate-200 dark:bg-slate-800'>
                      <input
                        className='outline-none focus-within:ring-2 rounded-md shadow-md px-1 py-2 dark:bg-slate-700 w-36'
                        type='time'
                        name='login'
                        id='login'
                        // step={300}
                        // pattern="(?:1[012]|0[0-9]):[0-5][0-9] (?:AM|PM)"
                        onChange={(e) => {
                          setLoginTime(e.target.value);
                          setHoursTime(
                            calculateTimeSpentInHrsMins(
                              e.target.value,
                              logoutTime
                            )
                          );
                        }}
                        placeholder='hh:mm AM/PM'
                        value={loginTime}
                      />
                      <h4 className='text-lg font-medium'>Log-In</h4>
                    </div>
                    <div className='time inline-flex flex-col justify-center items-center gap-2 p-4 rounded-md shadow-md bg-slate-200 dark:bg-slate-800'>
                      <input
                        className='outline-none focus-within:ring-2 rounded-md shadow-md px-1 py-2 dark:bg-slate-700 w-36'
                        type='time'
                        name='logout'
                        id='logout'
                        onChange={(e) => {
                          setLogoutTime(e.target.value);
                          setHoursTime(
                            calculateTimeSpentInHrsMins(
                              loginTime,
                              e.target.value
                            )
                          );
                        }}
                        placeholder='hh:mm AM/PM'
                        value={logoutTime}
                      />

                      <h4 className='text-lg font-medium'>Log-Out</h4>
                    </div>

                    <div className='time flex flex-col justify-center items-center gap-2 p-4 rounded-md shadow-md bg-slate-200 dark:bg-slate-800'>
                      <input
                        className='outline-none focus-within:ring-2 rounded-md shadow-md px-1 py-2 w-36 dark:bg-slate-700 text-center'
                        type='text'
                        onChange={(e) => setHoursTime(e.target.value)}
                        placeholder='HH:MM'
                        maxLength={5}
                        value={hoursTime === '-' ? null : hoursTime}
                      />

                      <h4 className='text-lg font-medium'>Time-Spent</h4>
                    </div>
                    <div className='time flex flex-col justify-center items-center gap-2 p-4 rounded-md shadow-md bg-slate-200 dark:bg-slate-800'>
                      <ListBoxComp
                        note={note.includes('Others') ? 'Others' : note}
                        loginTime={loginTime}
                        logoutTime={logoutTime}
                        hoursTime={hoursTime}
                        setNote={setNote}
                        setIsLeave={setIsLeave}
                        setLoginTime={setLoginTime}
                        setLogoutTime={setLogoutTime}
                        setHoursTime={setHoursTime}
                      />

                      {note.includes('Others') && (
                        <input
                          className='outline-none focus-within:ring-2 rounded-md shadow-md px-1 py-2 w-36 dark:bg-slate-700 pl-3 capitalize'
                          type='search'
                          onChange={(e) => setOtherNote(e.target.value)}
                          placeholder='Remark'
                          maxLength={100}
                          value={otherNote}
                        />
                      )}

                      <h4 className='text-lg font-medium'>Remark</h4>
                    </div>

                    <label
                      htmlFor='leave'
                      className='flex items-center space-x-1.5'
                    >
                      <input
                        type='checkbox'
                        checked={isLeave}
                        onChange={(e) => {}}
                        id='leave'
                        className=''
                        onClick={handleLeave}
                      />
                      <p className='mt-0.5 lg:-mt-0.5'>Mark as Leave?</p>
                    </label>

                    <section className='flex col-span-2'>
                      <button
                        type='submit'
                        className='col-span-2 mx-auto w-28 font-bold bg-slate-700 px-4 py-2 rounded-md shadow-md text-white'
                      >
                        Submit
                      </button>
                      <button
                        type='button'
                        className='col-span-2 mx-auto w-28 font-bold bg-red-700 dark:bg-red-800 px-4 py-2 rounded-md shadow-md text-white'
                        onClick={handleReset}
                      >
                        Reset
                      </button>
                    </section>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
