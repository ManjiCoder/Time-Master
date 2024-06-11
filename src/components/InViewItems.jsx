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
      className='m-auto flex h-36 w-full p-2 md:h-44 md:max-w-xl lg:max-w-2xl'
    >
      <div className='flex w-[30%] flex-col items-center justify-center rounded-l-lg bg-cyan-800'>
        <div className='mb-0.5 grid h-6 w-[70%] place-items-center rounded-tl-lg rounded-tr-lg bg-slate-50 text-sm font-bold max-ss:text-xs'>
          {day}
        </div>
        <div
          className={`grid h-16 w-[70%] place-items-center rounded-bl-lg rounded-br-lg bg-slate-100 text-4xl font-bold ${
            isAbsent && 'text-red-500'
          } ${isLeave && 'text-pink-500'} ${
            isHoliday && 'text-green-600/85 dark:text-green-600'
          }`}
        >
          {dayNum.toString().padStart(2, '0')}
        </div>
      </div>

      <div className='relative grid w-[70%] flex-col items-center justify-center rounded-r-lg bg-slate-800 pt-2 font-bold text-white'>
        <div className='flex justify-center text-sm md:pb-2 md:text-base'>
          <p>
            <span className='font-semibold'>
              {format(parseDate, 'dd-MMM-yyyy')}
            </span>
          </p>
          {/* Edit-Btn */}
          <button
            className='absolute right-3 text-blue-500 hover:text-blue-400'
            onClick={() => {
              setIsEditOpen(!isEditOpen);
              dispatch(setTargetDate(date));
            }}
          >
            <PencilSquareIcon className='w-5' />
          </button>
          {/* Delete-Btn */}
          <button
            className='absolute left-3 text-red-500 hover:text-red-400'
            onClick={() => {
              setIsDeleteOpen(!isDeleteOpen);
              dispatch(setTargetDate(date));
            }}
          >
            <TrashIcon className='w-5' />
          </button>
        </div>
        <div className='flex gap-1 text-center'>
          <div>
            <div
              className={`flex w-[5rem] max-w-full items-center justify-center rounded-md bg-slate-600 px-2 py-3 text-center text-xl font-bold shadow-md max-ss:w-[4rem] max-ss:text-sm md:w-28`}
            >
              {loginTime?.toLowerCase().includes('am')
                ? loginTime.slice(0, loginTime.length - 3)
                : loginTime?.toLowerCase().includes('pm')
                  ? loginTime.slice(0, loginTime.length - 3)
                  : loginTime}
              <span className='-mb-1.5 ml-0.5 text-xs font-light'>
                {loginTime == '-'
                  ? ''
                  : loginTime?.toLowerCase().includes('pm')
                    ? 'PM'
                    : 'AM'}
              </span>
            </div>
            <div className='w-[5rem] max-w-full rounded-md font-semibold shadow-md max-ss:w-[4rem] max-ss:text-sm md:w-28'>
              Login
            </div>
          </div>
          <div>
            <div
              className={`flex w-[5rem] max-w-full items-center justify-center rounded-md bg-slate-600 px-2 py-3 text-center text-xl font-bold shadow-md max-ss:w-[4rem] max-ss:text-sm md:w-28`}
            >
              {logoutTime?.toLowerCase().includes('pm')
                ? logoutTime.slice(0, logoutTime.length - 3)
                : logoutTime.toLowerCase().includes('am')
                  ? logoutTime.slice(0, logoutTime.length - 3)
                  : logoutTime}
              <span className='-mb-1.5 ml-0.5 text-xs font-light'>
                {logoutTime == '-'
                  ? ''
                  : logoutTime?.toLowerCase().includes('pm')
                    ? 'PM'
                    : 'AM'}
              </span>
            </div>
            <div className='w-[5rem] max-w-full rounded-md font-semibold shadow-md max-ss:w-[4rem] max-ss:text-sm md:w-28'>
              Logout
            </div>
          </div>
          <div>
            <div
              className={`w-[5rem] max-w-full rounded-md bg-slate-600 px-2 py-3 text-center text-xl font-bold shadow-md max-ss:w-[4rem] max-ss:text-sm md:w-28`}
            >
              {hours}
            </div>
            <div className='w-[5rem] max-w-full rounded-md font-semibold shadow-md max-ss:w-[4rem] max-ss:text-sm md:w-28'>
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
