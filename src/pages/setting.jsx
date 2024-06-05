import { Baloo_Bhai_2 } from 'next/font/google';
import Link from 'next/link';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import EditAmountModal from '@/components/EditAmountModal';
import ExportData from '@/components/ExportDataBtn';
import MyModal from '@/components/HeadlessUI/Modal';
import ProTax from '@/components/ProTax';
import SalaryInfo from '@/components/SalaryInfo';
import ToggleThemeBtn from '@/components/ToggleThemeBtn';
import YearMonthPicker from '@/components/YearMonthPicker';
import { deleteByMonthYear } from '@/redux/slices/attendanceSlice';
import { toggleIsShowAmt } from '@/redux/slices/dateSlice';
import { PencilSquareIcon } from '@heroicons/react/20/solid';
import { toast } from 'react-toastify';

const inter = Baloo_Bhai_2({ subsets: ['latin'] });

export default function Setting() {
  const currentDate = new Date();
  const initialState = {
    year: currentDate.getFullYear(),
    month: currentDate.getMonth() + 1,
  };
  const { salaryAmount } = useSelector((state) => state.userSettings);
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);
  const [expDetails, setExpDetails] = useState(initialState);
  const [clearDetails, setClearDetails] = useState({
    ...initialState,
    year: null,
    month: null,
  });

  const [isOpenModal, setIsOpenModal] = useState(false);

  function closeModal() {
    setIsOpenModal(false);
  }

  function openModal() {
    setIsOpenModal(true);
  }

  const handleClick = () => {
    dispatch(toggleIsShowAmt());
    setIsOpen(!isOpen);
  };
  const handleDeleteByMonth = () => {
    const { month, year } = clearDetails;
    if (month && year) {
      dispatch(
        deleteByMonthYear({
          month: month,
          year: year,
        })
      );
    } else {
      toast.warn(`Select The Month First!`);
    }
    closeModal();
  };

  return (
    <main
      className={`bg-slate-300 dark:bg-slate-900 dark:text-white text-slate-800 min-h-screen pb-10 ${inter.className} py-4`}
    >
      <h2 className='text-2xl font-semibold px-4'>Settings</h2>
      <ol className='flex flex-col mt-4 text-lg'>
        <li className='bg-slate-200 dark:bg-slate-800 shadow-md rounded-md py-4 px-4 border border-slate-400'>
          <Link href={'/'}>Home</Link>
        </li>
        <li className='bg-slate-200 dark:bg-slate-800 shadow-md rounded-md py-4 px-4 border border-slate-400'>
          <Link href={'/upload'}>Upload File</Link>
        </li>
        {/* <li className="bg-slate-200 dark:bg-slate-800 shadow-md rounded-md py-4 px-4 border border-slate-400">
          <Link href={'/text'}>Text-To-TimeLogs</Link>
        </li> */}
        <li className='bg-slate-200 dark:bg-slate-800 shadow-md rounded-md py-4 px-4 border border-slate-400 flex space-x-2 items-center justify-start'>
          Salary Amount :
          <span className='ml-1 font-semibold' hidden>
            {salaryAmount}
          </span>
          <span className='ml-1 relative top-1.5 text-center text-2xl leading-[0] font-bold'>
            *********
          </span>
          <button
            className='outline-none pr-3'
            type='button'
            onClick={handleClick}
            title='Edit'
          >
            <PencilSquareIcon className='w-5 text-blue-600' />
          </button>
          <SalaryInfo />
        </li>
        <ProTax />
        <li className='bg-slate-200 dark:bg-slate-800 shadow-md rounded-md py-4 px-4 border border-slate-400 flex space-x-2 items-center justify-start'>
          Theme Mode - <ToggleThemeBtn />
        </li>
        <li className='bg-slate-200 dark:bg-slate-800 shadow-md rounded-md py-4 px-4 border border-slate-400 flex space-x-2 items-center justify-start'>
          Export Data -{' '}
          <YearMonthPicker
            defaultDate={`${initialState.year}-${initialState.month
              .toString()
              .padStart(2, '0')}`}
            setExpDetails={setExpDetails}
          />
          <ExportData
            year={expDetails.year || initialState.year}
            month={expDetails.month || initialState.month}
          />
        </li>
        <li className='bg-slate-200 dark:bg-slate-800 shadow-md rounded-md py-4 px-4 border border-slate-400 flex space-x-2 items-center justify-start'>
          Delete Data - <YearMonthPicker setExpDetails={setClearDetails} />
          <button
            type='button'
            onClick={() => {
              const { month, year } = clearDetails;
              if (month && year) {
                openModal();
              } else {
                toast.warn(`Select The Month First!`);
              }
            }}
            className='ml-2 w-24 bg-red-700 px-3 font-bold text-sm py-2.5 rounded-md shadow-md text-white'
          >
            Delete
          </button>
        </li>
      </ol>
      {isOpenModal && (
        <MyModal
          title={`Delete ${clearDetails.month}-${clearDetails.year} Records`}
          desc={
            <p>
              Are you sure you want to delete {clearDetails.month}-
              {clearDetails.year}?
              <br />
              All of your data will be permanently removed.
              <br /> This action cannot be undone.
            </p>
          }
          closeModal={closeModal}
          handleClick={handleDeleteByMonth}
        />
      )}
      {/* Set Amount Modal */}
      {isOpen && <EditAmountModal isOpen={isOpen} setIsOpen={setIsOpen} />}
    </main>
  );
}
