import { setTargetDate } from '@/redux/slices/dateSlice';
import { items } from '@/utils/Animation';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/20/solid';
import { format } from 'date-fns';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useDispatch } from 'react-redux';
import Remark from './Remark';

export default function InViewItems({
  idx,
  date,
  day,
  dayNum,
  parseDate,
  isAbsent,
  isLeave,
  isHoliday,
  loginTime,
  logoutTime,
  hours,
  remark,
  isEditOpen,
  setIsEditOpen,
  isDeleteOpen,
  setIsDeleteOpen,
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const dispatch = useDispatch();

  return (
    <motion.div
      ref={ref}
      variants={items}
      animate={isInView ? 'show' : 'hidden'}
      key={date}
      className='h-36 md:h-44 w-full md:max-w-xl lg:max-w-2xl p-2 flex m-auto'
    >
      <div className='bg-cyan-800 w-[30%] flex flex-col items-center justify-center rounded-l-lg'>
        <div className='bg-slate-50 w-[70%] rounded-tr-lg rounded-tl-lg h-6 mb-0.5 text-sm font-bold grid place-items-center'>
          {day}
        </div>
        <div
          className={`bg-slate-100 w-[70%] rounded-br-lg rounded-bl-lg h-16 grid place-items-center font-bold text-4xl ${
            isAbsent && 'text-red-500'
          } ${isLeave && 'text-pink-500'} ${
            isHoliday && 'dark:text-green-600 text-green-600/85'
          }`}
        >
          {dayNum.toString().padStart(2, '0')}
        </div>
      </div>

      <div className='bg-slate-800 w-[70%] rounded-r-lg grid items-center justify-center font-bold text-white flex-col relative pt-2'>
        <div className='flex justify-center text-sm md:text-base md:pb-2'>
          <p>
            <span className='font-semibold'>
              {format(parseDate, 'dd-MMM-yyyy')}
            </span>
          </p>
          {/* Edit-Btn */}
          <button
            className='text-blue-500 absolute right-3 hover:text-blue-400'
            onClick={() => {
              setIsEditOpen(!isEditOpen);
              dispatch(setTargetDate(date));
            }}
          >
            <PencilSquareIcon className='w-5' />
          </button>
          {/* Delete-Btn */}
          <button
            className='text-red-500 absolute left-3 hover:text-red-400'
            onClick={() => {
              setIsDeleteOpen(!isDeleteOpen);
              dispatch(setTargetDate(date));
            }}
          >
            <TrashIcon className='w-5' />
          </button>
        </div>
        <div className='flex text-center gap-1'>
          <div>
            <div
              className={`bg-slate-600 flex items-center justify-center w-[5rem] md:w-28 max-w-full text-center rounded-md shadow-md text-xl font-bold py-3 px-2 `}
            >
              {loginTime?.toLowerCase().includes('am')
                ? loginTime.slice(0, loginTime.length - 3)
                : loginTime?.toLowerCase().includes('pm')
                ? loginTime.slice(0, loginTime.length - 3)
                : loginTime}
              <span className='ml-0.5 -mb-1.5 text-xs font-light'>
                {loginTime == '-'
                  ? ''
                  : loginTime?.toLowerCase().includes('pm')
                  ? 'PM'
                  : 'AM'}
              </span>
            </div>
            <div className='w-[5rem] md:w-28 max-w-full rounded-md shadow-md font-semibold'>
              Login
            </div>
          </div>
          <div>
            <div
              className={`bg-slate-600 flex justify-center items-center w-[5rem] md:w-28 max-w-full text-center rounded-md shadow-md text-xl font-bold py-3 px-2 `}
            >
              {logoutTime?.toLowerCase().includes('pm')
                ? logoutTime.slice(0, logoutTime.length - 3)
                : logoutTime.toLowerCase().includes('am')
                ? logoutTime.slice(0, logoutTime.length - 3)
                : logoutTime}
              <span className='ml-0.5 -mb-1.5 text-xs font-light'>
                {logoutTime == '-'
                  ? ''
                  : logoutTime?.toLowerCase().includes('pm')
                  ? 'PM'
                  : 'AM'}
              </span>
            </div>
            <div className='w-[5rem] md:w-28 max-w-full rounded-md shadow-md font-semibold'>
              Logout
            </div>
          </div>
          <div>
            <div
              className={`bg-slate-600 w-[5rem] md:w-28 max-w-full text-center rounded-md shadow-md text-xl font-bold py-3 px-2 `}
            >
              {hours}
            </div>
            <div className='w-[5rem] md:w-28 max-w-full rounded-md shadow-md font-semibold'>
              Time
            </div>
          </div>
        </div>
        {/* For IMP Note */}
        <Remark msg={remark} />
      </div>
    </motion.div>
  );
}
