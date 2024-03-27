import { Baloo_Bhai_2 } from 'next/font/google';
import Link from 'next/link';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import EditAmountModal from '@/components/EditAmountModal';
import { PencilSquareIcon } from '@heroicons/react/20/solid';
import ToggleThemeBtn from '@/components/ToggleThemeBtn';
import ExportData from '@/components/ExportDataBtn';
import { toggleIsShowAmt } from '@/redux/slices/dateSlice';

const inter = Baloo_Bhai_2({ subsets: ['latin'] });

export default function Setting() {
  const { salaryAmount } = useSelector((state) => state.userSettings);
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);
  const handleClick = () => {
    dispatch(toggleIsShowAmt());
    setIsOpen(!isOpen);
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
          <span
            className='ml-1 font-semibold'
            hidden
          >
            {salaryAmount}
          </span>
          <span className='ml-1 relative top-1.5 text-center text-2xl leading-[0] font-bold'>
            *********
          </span>
          <button
            className='outline-none'
            type='button'
            onClick={handleClick}
          >
            <PencilSquareIcon className='w-5 mb-1 text-blue-600' />
          </button>
        </li>
        <li className='bg-slate-200 dark:bg-slate-800 shadow-md rounded-md py-4 px-4 border border-slate-400 flex space-x-2 items-center justify-start'>
          Theme Mode - <ToggleThemeBtn />
        </li>
        <li className='bg-slate-200 dark:bg-slate-800 shadow-md rounded-md py-4 px-4 border border-slate-400 flex space-x-2 items-center justify-start'>
          Export Data - <ExportData />
        </li>
      </ol>

      {/* Set Amount Modal */}
      {isOpen && (
        <EditAmountModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
      )}
    </main>
  );
}
