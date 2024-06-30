import { filterOrder } from '@/redux/slices/UserSettings';
import { variants } from '@/utils/Animation';
import { holidayDetails } from '@/utils/constants';
import { format24To12, formattedTime12, isHolidays } from '@/utils/dateService';
import { format, getDate } from 'date-fns';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import InViewItems from './InViewItems';

export default function AttendanceItems({
  showDates,
  isEditOpen,
  isDeleteOpen,
  setIsEditOpen,
  setIsDeleteOpen,
}) {
  const attendance = useSelector((state) => state.attendance);
  const { year, month } = useSelector((state) => state.dateSlice);
  const { isOfficeMode, order } = useSelector((state) => state.userSettings);
  const dispatch = useDispatch();

  const currentDate = new Date();

  return (
    <motion.section variants={variants} initial='hidden' animate='show'>
      {showDates
        .sort((a, b) => {
          a = parseInt(a);
          b = parseInt(b);
          if (order === filterOrder.ascending) {
            return a - b;
          } else if (order === filterOrder.descending) {
            return b - a;
          }
        })
        .map((date, index) => {
          const obj = attendance[year][month][date];
          const parseDate = new Date(parseInt(date));
          const day = format(parseDate, 'EEEE');
          const dayNum = getDate(parseDate);
          const isHoliday = isHolidays(parseDate, dayNum);
          const isLeave = obj.leave === '1' || obj.leave === '0.5';
          const isAbsent =
            date <= currentDate.setHours(0, 0, 0, 0) &&
            !isHoliday &&
            !isLeave &&
            obj.present !== '1';

          let remark =
            obj?.remark ||
            (obj?.leave === '1' && 'Leave') ||
            (obj?.present === '0.5' && 'Half Day') ||
            (isAbsent && 'Absent') ||
            null;

          if (remark && remark.includes('Others - ')) {
            remark = remark.replaceAll('Others - ', '');
          }
          if (isHoliday) {
            if (obj.remark && obj.remark !== '') {
              remark = `Holiday - ${
                obj.remark.includes('Holiday - ')
                  ? obj.remark.replaceAll('Holiday - ', '')
                  : obj.remark
              }`;
            } else {
              if (holidayDetails[parseInt(date)]) {
                remark = `Holiday - ${holidayDetails[parseInt(date)].desc}`;
              } else {
                remark = 'Holiday';
              }
            }
          }
          if (
            date === currentDate.setHours(0, 0, 0, 0).toString() &&
            isOfficeMode
          ) {
            remark = "You're in the Office";
          }
          // console.log(obj)
          let loginTime = obj.login;
          let logoutTime = obj.logout;
          loginTime = loginTime ? formattedTime12(loginTime) : '00:00';
          logoutTime = logoutTime ? format24To12(logoutTime) : '00:00';

          if (!obj.login.includes(':')) {
            loginTime = '-';
          }
          if (!obj.logout.includes(':')) {
            logoutTime = '-';
          }

          // if (obj.present === '-') return;
          // // TODO: total days

          return (
            // <motion.div
            //   variants={items}
            //   key={date}
            //   className='h-36 md:h-44 w-full md:max-w-xl lg:max-w-2xl p-2 flex m-auto'
            // >
            //   <div className='bg-cyan-800 w-[30%] flex flex-col items-center justify-center rounded-l-lg'>
            //     <div className='bg-slate-50 w-[70%] rounded-tr-lg rounded-tl-lg h-6 mb-0.5 text-sm font-bold grid place-items-center'>
            //       {day}
            //     </div>
            //     <div
            //       className={`bg-slate-100 w-[70%] rounded-br-lg rounded-bl-lg h-16 grid place-items-center font-bold text-4xl ${
            //         isAbsent && 'text-red-500'
            //       } ${isLeave && 'text-pink-500'} ${
            //         isHoliday && 'dark:text-green-600 text-green-600/85'
            //       }`}
            //     >
            //       {dayNum.toString().padStart(2, '0')}
            //     </div>
            //   </div>

            //   <div className='bg-slate-800 w-[70%] rounded-r-lg grid items-center justify-center font-bold text-white flex-col relative pt-2'>
            //     <div className='flex justify-center text-sm md:text-base md:pb-2'>
            //       <p>
            //         <span className='font-semibold'>
            //           {format(parseDate, 'dd-MMM-yyyy')}
            //         </span>
            //       </p>
            //       {/* Edit-Btn */}
            //       <button
            //         className='text-blue-500 absolute right-3 hover:text-blue-400'
            //         onClick={() => {
            //           setIsEditOpen(!isEditOpen);
            //           dispatch(setTargetDate(date));
            //         }}
            //       >
            //         <PencilSquareIcon className='w-5' />
            //       </button>
            //       {/* Delete-Btn */}
            //       <button
            //         className='text-red-500 absolute left-3 hover:text-red-400'
            //         onClick={() => {
            //           setIsDeleteOpen(!isDeleteOpen);
            //           dispatch(setTargetDate(date));
            //         }}
            //       >
            //         <TrashIcon className='w-5' />
            //       </button>
            //     </div>
            //     <div className='flex text-center gap-1'>
            //       <div>
            //         <div
            //           className={`bg-slate-600 flex items-center justify-center w-[5rem] md:w-28 max-w-full text-center rounded-md shadow-md text-xl font-bold py-3 px-2 `}
            //         >
            //           {loginTime?.toLowerCase().includes('am')
            //             ? loginTime.slice(0, loginTime.length - 3)
            //             : loginTime?.toLowerCase().includes('pm')
            //             ? loginTime.slice(0, loginTime.length - 3)
            //             : loginTime}
            //           <span className='ml-0.5 -mb-1.5 text-xs font-light'>
            //             {loginTime == '-'
            //               ? ''
            //               : loginTime?.toLowerCase().includes('pm')
            //               ? 'PM'
            //               : 'AM'}
            //           </span>
            //         </div>
            //         <div className='w-[5rem] md:w-28 max-w-full rounded-md shadow-md font-semibold'>
            //           Login
            //         </div>
            //       </div>
            //       <div>
            //         <div
            //           className={`bg-slate-600 flex justify-center items-center w-[5rem] md:w-28 max-w-full text-center rounded-md shadow-md text-xl font-bold py-3 px-2 `}
            //         >
            //           {logoutTime?.toLowerCase().includes('pm')
            //             ? logoutTime.slice(0, logoutTime.length - 3)
            //             : logoutTime.toLowerCase().includes('am')
            //             ? logoutTime.slice(0, logoutTime.length - 3)
            //             : logoutTime}
            //           <span className='ml-0.5 -mb-1.5 text-xs font-light'>
            //             {logoutTime == '-'
            //               ? ''
            //               : logoutTime?.toLowerCase().includes('pm')
            //               ? 'PM'
            //               : 'AM'}
            //           </span>
            //         </div>
            //         <div className='w-[5rem] md:w-28 max-w-full rounded-md shadow-md font-semibold'>
            //           Logout
            //         </div>
            //       </div>
            //       <div>
            //         <div
            //           className={`bg-slate-600 w-[5rem] md:w-28 max-w-full text-center rounded-md shadow-md text-xl font-bold py-3 px-2 `}
            //         >
            //           {obj?.hours || '-'}
            //         </div>
            //         <div className='w-[5rem] md:w-28 max-w-full rounded-md shadow-md font-semibold'>
            //           Time
            //         </div>
            //       </div>
            //     </div>
            //     {/* For IMP Note */}
            //     <Remark msg={remark} />
            //   </div>
            // </motion.div>
            <InViewItems
              key={date}
              idx={index}
              date={date}
              day={day}
              dayNum={dayNum}
              parseDate={parseDate}
              isAbsent={isAbsent}
              isLeave={isLeave}
              isHoliday={isHoliday}
              loginTime={loginTime}
              logoutTime={logoutTime}
              hours={obj?.hours || '-'}
              remark={remark}
              isEditOpen={isEditOpen}
              isDeleteOpen={isDeleteOpen}
              setIsEditOpen={setIsEditOpen}
              setIsDeleteOpen={setIsDeleteOpen}
            />
          );
        })}
    </motion.section>
  );
}
