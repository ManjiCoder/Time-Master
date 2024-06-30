import { editByDate } from '@/redux/slices/attendanceSlice';
import { remarkObj } from '@/utils/constants';
import {
  calculateTimeSpent,
  format24To12,
  isHolidays,
  isValidTime,
  removeAMorPM,
} from '@/utils/dateService';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/20/solid';
import { addMinutes, format, getDate, parse } from 'date-fns';
import { Fragment, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import ListBoxComp from './HeadlessUI/ListBoxComp';

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
      hours: [null, ''].includes(hoursTime) ? '-' : hoursTime,
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

    if (isValidTime(loginTime, logoutTime)) {
      return toast.warn('Invalid Time!');
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

    if (loginTime === '-' && logoutTime === '-') {
      editedData.present = '-';
    }
    if (hoursTime === '04:30') {
      editedData.present = '0.5';
      editedData.leave = '0.5';
    }
    const payload = {
      year,
      month,
      date: targetDate,
      data: editedData,
    };
    console.table(editedData);
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
    // dispatch(editByDate(payload));
  };

  const handleLeave = () => {
    setIsLeave(!isLeave);
    setLoginTime('09:00');
    setLogoutTime('18:00');
    setHoursTime('09:00');
    setNote(!isLeave ? 'Leave' : '');
  };

  const handleHalfDay = () => {
    setIsLeave(true);
    const isLogin = loginTime !== '-';
    const isLogout = logoutTime !== '-';
    if (isLogin && isLogout) {
      const time = parse(hoursTime, 'HH:mm', new Date());
      const totalTime = addMinutes(time, 4 * 60 + 30).getHours();
      // console.log(time, totalTime);
      if (totalTime >= 9) {
        setHoursTime('09:00');
      }
    } else {
      setLoginTime('10:00');
      setLogoutTime('14:30');
      setHoursTime('04:30');
    }
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
                <Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-slate-900'>
                  <Dialog.Title
                    as='h3'
                    className='mb-3 text-center text-2xl font-medium leading-6 text-gray-900 dark:text-white'
                  >
                    Are you sure?
                  </Dialog.Title>
                  <button onClick={closeModal}>
                    <XMarkIcon className='absolute right-4 top-5 w-7 text-xl text-gray-900 dark:text-white' />
                  </button>
                  <h2 className='mb-4 text-center font-medium text-gray-900 dark:text-white'>
                    Do you want to edit the{' '}
                    {format(
                      attendance[year][month][targetDate].date,
                      'dd-MMM-yyyy'
                    )}{' '}
                    TimeLog?
                  </h2>

                  <form
                    className='my-5 grid grid-cols-2 items-center justify-evenly gap-4 text-gray-900 dark:text-white'
                    onSubmit={handleEdit}
                  >
                    <div className='time inline-flex flex-col items-center justify-center gap-2 rounded-md bg-slate-200 p-4 shadow-md dark:bg-slate-800'>
                      <input
                        className={`w-36 rounded-md px-1 py-2 shadow-md outline-none focus-within:ring-2 dark:bg-slate-700 max-xs:w-28 max-ss:w-24 ${
                          isValidTime(loginTime, logoutTime) &&
                          'ring-2 ring-red-500'
                        }`}
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
                      <h4 className='font-medium max-ss:text-sm xs:text-lg'>
                        Log-In
                      </h4>
                    </div>
                    <div className='time inline-flex flex-col items-center justify-center gap-2 rounded-md bg-slate-200 p-4 shadow-md dark:bg-slate-800'>
                      <input
                        className={`w-36 rounded-md px-1 py-2 shadow-md outline-none focus-within:ring-2 dark:bg-slate-700 max-xs:w-28 max-ss:w-24 ${
                          isValidTime(loginTime, logoutTime) &&
                          'ring-2 ring-red-500'
                        }`}
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

                      <h4 className='font-medium max-ss:text-sm xs:text-lg'>
                        Log-Out
                      </h4>
                    </div>

                    <div className='time flex flex-col items-center justify-center gap-2 rounded-md bg-slate-200 p-4 shadow-md dark:bg-slate-800'>
                      <input
                        className='w-36 rounded-md px-1 py-2 text-center shadow-md outline-none focus-within:ring-2 dark:bg-slate-700 max-xs:w-28 max-ss:w-24'
                        type='text'
                        onChange={(e) => setHoursTime(e.target.value)}
                        placeholder='HH:MM'
                        maxLength={5}
                        value={hoursTime === '-' ? null : hoursTime}
                      />

                      <h4 className='font-medium max-ss:text-sm xs:text-lg'>
                        Time-Spent
                      </h4>
                    </div>
                    <div className='time flex flex-col items-center justify-center gap-2 rounded-md bg-slate-200 p-4 shadow-md dark:bg-slate-800'>
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
                        otherNote={otherNote}
                        setOtherNote={setOtherNote}
                        handleHalfDay={handleHalfDay}
                      />

                      {/* {note.includes('Others') && (
                        <input
                          className='outline-none focus-within:ring-2 rounded-md shadow-md px-1 py-2 max-ss:w-24 max-xs:w-28 w-36 dark:bg-slate-700 pl-3 capitalize'
                          type='search'
                          onChange={(e) => setOtherNote(e.target.value)}
                          placeholder='Remark'
                          maxLength={100}
                          value={otherNote}
                        />
                      )} */}

                      <h4 className='font-medium max-ss:text-sm xs:text-lg'>
                        Remark
                      </h4>
                    </div>

                    <label
                      htmlFor='leave'
                      className='col-span-2 flex items-center space-x-1.5'
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

                    <section className='col-span-2 mt-5 flex'>
                      <button
                        type='submit'
                        className='order-1 col-span-2 mx-auto w-28 rounded-md bg-blue-700 px-4 py-2 font-bold text-white shadow-md dark:bg-blue-500'
                      >
                        Submit
                      </button>
                      <button
                        type='button'
                        className='col-span-2 mx-auto w-28 rounded-md bg-red-700 px-4 py-2 font-bold text-white shadow-md dark:bg-red-800'
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
