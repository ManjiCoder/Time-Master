import { formatAmt } from '@/utils/constants';
import { isHolidays } from '@/utils/dateService';
import { calculateSalary } from '@/utils/salary';
import { InformationCircleIcon, XMarkIcon } from '@heroicons/react/20/solid';
import { getDate } from 'date-fns';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import EditAmountModal from './EditAmountModal';
import MyModal from './HeadlessUI/Modal';
import ListBoxMonths from './ListBoxMonths';
import ListBoxYears from './ListBoxYears';

export default function SalaryInfo() {
  const { salaryAmount } = useSelector((state) => state.userSettings);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button
        className='outline-none rounded-full bg-slate-950 dark:bg-slate-700'
        type='button'
        onClick={() => {
          if (salaryAmount) {
            setIsOpen(!isOpen);
          } else {
            setIsEditModalOpen(!isEditModalOpen);
          }
        }}
      >
        <InformationCircleIcon className='w-5 text-yellow-400' />
      </button>
      {isEditModalOpen && (
        <EditAmountModal
          isOpen={isEditModalOpen}
          setIsOpen={setIsEditModalOpen}
        />
      )}
      {isOpen && (
        <MyModal closeModal={closeModal}>
          <ModalContent closeModal={closeModal} />
        </MyModal>
      )}
    </>
  );
}

export function ModalContent({ closeModal }) {
  const currentDate = new Date().setHours(0, 0, 0, 0);
  const attendance = useSelector((state) => state.attendance);
  const {
    minRate,
    overTimeMinRate,
    salaryAmount: salaryAmt,
  } = useSelector((state) => state.userSettings);
  const { isShowAmt, year, month } = useSelector((state) => state.dateSlice);
  const { taxRates } = useSelector((state) => state.proTax);

  const [totalTimeSpent, setTotalTimeSpent] = useState({
    hrs: 0,
    mins: 0,
    days: 0,
    workedDays: 0,
    absentDays: 0,
    totalHolidays: 0,
    holidaysLeft: 0,
    overTimeHrs: 0,
    overTimeMins: 0,
    overTimeDays: 0,
  });

  // Calculate total hours when attendance changes
  const totalTimeObj = () => {
    let payload = {
      hrs: 0,
      mins: 0,
      days: 0,
      workedDays: 0,
      absentDays: 0,
      totalHolidays: 0,
      holidaysLeft: 0,
      overTimeHrs: 0,
      overTimeMins: 0,
      overTimeDays: 0,
    };

    try {
      const timeLog = attendance[year][month];
      Object?.keys(timeLog).filter((v, i, a) => {
        v = parseInt(v);
        const parseDate = new Date(v);
        const dayNum = getDate(parseDate);
        const isHoliday = isHolidays(parseDate, dayNum);
        const isLeave = timeLog[v].leave === '1';

        if (timeLog[v].present !== '-') {
          if (!timeLog[v].isHoliday) {
            payload.days += 1;
          }
          payload.workedDays += parseFloat(timeLog[v].present);
          // TODO:Refractor
          let timeInHrsMin = timeLog[v].hours.split(':').filter((v, i) => {
            v = parseInt(v);
            if (i === 0) {
              payload.hrs = payload.hrs + v;
              // TODO: For Leave if (isHoliday || isLeave) {
              if (isHoliday) {
                payload.overTimeDays = payload.overTimeDays + 1;
              }
              if (isHoliday) {
                payload.overTimeHrs = payload.overTimeHrs + v;
              }
            } else {
              payload.mins = payload.mins + v;
              if (isHoliday) {
                payload.overTimeMins = payload.overTimeMins + v;
              }
            }
          });
        } else if (isLeave) {
          payload.days += 1;
          payload.workedDays += 1;
          payload.hrs += 9;
        }
        if (isHoliday) {
          payload.totalHolidays += 1;
          if (v >= currentDate) {
            payload.holidaysLeft += 1;
          }
        }
        if (timeLog[v].present === '-' && !isHoliday && !isLeave) {
          payload.absentDays += 1;
        }
      });
      return payload;
    } catch (error) {
      console.log('object');
      return payload;
    }
  };

  useEffect(() => {
    // Update the state with the total hours
    const data = totalTimeObj();
    setTotalTimeSpent(data);
    // console.log(data);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attendance, year, month]);
  const {
    days: tDays,
    hrs,
    mins,
    workedDays,
    totalHolidays,
    holidaysLeft,
    overTimeHrs,
    overTimeMins,
    overTimeDays,
    absentDays,
  } = totalTimeSpent;
  const days = tDays - overTimeDays === 0 ? tDays : tDays - overTimeDays;

  const holidaysTimeInMins = (totalHolidays - holidaysLeft) * 9 * 60;
  const overTimeInMins = overTimeHrs * 60 + overTimeMins;
  const totalTimeSpendInMins = hrs * 60 + mins;
  const totalExpectedTimeSpendInMins = days * 9 * 60;
  const timeDiffMins = -(totalExpectedTimeSpendInMins - totalTimeSpendInMins);
  const totalMinsR = Math.abs(timeDiffMins % 60);
  const totalHrsR = parseInt(Math.abs(timeDiffMins / 60));
  const rawAvg = totalTimeSpendInMins / 60 / days;
  const avg = Math.floor(rawAvg * 100) / 100;

  const hoursLeft =
    totalTimeSpendInMins > totalExpectedTimeSpendInMins
      ? 0
      : Math.abs(timeDiffMins / 60);
  const salaryAmount =
    days === 0
      ? 0
      : calculateSalary(
          salaryAmt,
          hoursLeft,
          absentDays,
          month,
          overTimeInMins / 60,
          taxRates
        );
  const expectedSalaryAmount = calculateSalary(
    salaryAmt,
    0,
    0,
    month,
    0,
    taxRates
  );
  const detuctedAmount =
    Math.sign(expectedSalaryAmount - salaryAmount) === -1
      ? 0
      : expectedSalaryAmount - salaryAmount;

  return (
    <div className='min-h-96 text-gray-900 dark:text-white max-sm:w-[80vw]'>
      <div>
        <h2 className='text-xl  dark:text-white text-center font-semibold'>
          Salary Info
        </h2>
        <button onClick={closeModal}>
          <XMarkIcon className='absolute top-5 right-4 w-7 text-gray-900 dark:text-white text-xl' />
        </button>
      </div>
      <div className='flex justify-end space-x-2 text-center'>
        <ListBoxYears />
        <ListBoxMonths />
      </div>
      <section className='flex justify-center mt-10'>
        <div className='flex mx-auto flex-col gap-y-1 mt-3 justify-start border dark:border-slate-700 p-3 rounded-md shadow-sm'>
          <span className='font-semibold flex justify-between gap-x-12'>
            <span>Basic Salary</span>{' '}
            {(salaryAmt ? salaryAmt : 0).toLocaleString('en-IN', formatAmt)}
          </span>

          <span className='text-red-500 font-semibold flex justify-between gap-x-12'>
            <span>P.T. Tax</span>{' '}
            {taxRates[month].toLocaleString('en-IN', formatAmt)}
          </span>

          <span className='text-red-500 font-semibold flex justify-between gap-x-12'>
            <span>Loss Of Pay</span>{' '}
            {detuctedAmount.toLocaleString('en-IN', formatAmt)}
          </span>
          <span className='text-green-500 font-semibold flex justify-between gap-x-12'>
            <span>Salary</span>{' '}
            {salaryAmount.toLocaleString('en-IN', formatAmt)}
          </span>
        </div>
      </section>
    </div>
  );
}
