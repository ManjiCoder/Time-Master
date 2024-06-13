import { XMarkIcon } from '@heroicons/react/20/solid';
import { LightBulbIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import MyModal from './HeadlessUI/Modal';

export default function FeatureReq() {
  const [isOpen, setIsOpen] = useState(false);
  const closeModal = () => {
    setIsOpen(false);
  };
  return (
    <>
      <button
        className='flex place-items-center rounded-md bg-yellow-500 px-3 py-2.5 text-center font-semibold text-slate-900 shadow-md'
        onClick={() => setIsOpen(!isOpen)}
      >
        <LightBulbIcon className='mr-1 w-7' />
        <span>Feature Request</span>
      </button>
      {isOpen && (
        <MyModal closeModal={closeModal}>
          <Form closeModal={closeModal} />
        </MyModal>
      )}
    </>
  );
}

export function Form({ closeModal }) {
  return (
    <form className='-mt-3 flex flex-col gap-y-3 px-2 py-3'>
      <h1 className='flex justify-between text-lg font-bold'>
        <span className='flex items-center gap-x-1.5'>
          <LightBulbIcon className='w-7' />
          Feature Request
        </span>
        <button onClick={closeModal}>
          <XMarkIcon className='w-9 text-gray-900 dark:text-white' />
        </button>
      </h1>
      <textarea
        cols='30'
        rows='3'
        placeholder='Enter Your Message.'
        className='rounded-md bg-slate-950/40 px-5 py-3 shadow-sm outline-none focus:ring-2'
      />
      <button
        type='submit'
        className='order-1 col-span-2 mx-auto w-28 rounded-md bg-blue-700 px-4 py-2 font-bold text-white shadow-md dark:bg-blue-500'
      >
        Submit
      </button>
    </form>
  );
}
