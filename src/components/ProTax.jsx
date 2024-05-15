import { setTaxRates } from '@/redux/slices/ProfessionalTax';
import { PencilSquareIcon, XMarkIcon } from '@heroicons/react/20/solid';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { formatNumber } from './EditAmountModal';
import MyModal from './HeadlessUI/Modal';

export default function ProTax() {
  const [isOpen, setIsOpen] = useState(false);
  const closeModal = () => {
    setIsOpen(false);
  };
  const toggleModal = () => {
    setIsOpen(!isOpen);
  };
  return (
    <>
      <li className='bg-slate-200 dark:bg-slate-800 shadow-md rounded-md py-4 px-4 border border-slate-400 flex space-x-2 items-center justify-start'>
        Professional Tax :<span className='ml-1 font-semibold' hidden></span>
        <span className='ml-2 relative top-1.5 text-center text-2xl leading-[0] font-bold'>
          *******
        </span>
        <button className='outline-none' type='button' onClick={toggleModal}>
          <PencilSquareIcon className='w-5 mb-1 text-blue-600' />
        </button>
      </li>
      {isOpen && (
        <MyModal title='Professional Tax' closeModal={closeModal}>
          <ProTaxForm closeModal={closeModal} />
        </MyModal>
      )}
    </>
  );
}

export function ProTaxForm({ closeModal }) {
  const { taxRates, month } = useSelector((state) => state.proTax);
  const dispatch = useDispatch();
  const [amount, setAmount] = useState(taxRates[month] || '');
  const [isChecked, setIsChecked] = useState(true);
  const inputRef = useRef(null);
  const handleChange = (e) => {
    setAmount(formatNumber(e.target.value));
  };

  const handleSubmit = () => {
    try {
      const isAmtString = typeof amount === 'string';
      const newTaxRates = {};
      Object.keys(taxRates).map((month) => {
        newTaxRates[month] = isChecked ? parseInt(isAmtString ? amount.replaceAll(',', '') : amount) : taxRates[month];
      });
      console.log(newTaxRates);
      //   dispatch(
      //     setMonthTax({
      //       month,
      //       amount: parseInt(isAmtString ? amount.replaceAll(',', '') : amount),
      //     })
      //   );
      dispatch(setTaxRates(newTaxRates));
      toast.success(
        `Tax Updated Successfully!`
      );
    } catch (error) {
      console.log(error);
      toast.error('Some error occured! Please try after sometime.');
    } finally {
      closeModal();
    }
  };

  useEffect(() => {
    inputRef.current.focus();
  }, []);
  return (
    <>
      <button onClick={closeModal}>
        <XMarkIcon className='absolute top-5 right-4 w-7 text-gray-900 dark:text-white text-xl' />
      </button>
      <form
        className='flex flex-col text-gray-900 dark:text-white gap-4 justify-evenly items-center'
        onSubmit={handleSubmit}
      >
        <div className='time inline-flex flex-col justify-center items-center gap-2 rounded-md shadow-md bg-slate-50 dark:bg-slate-800'>
          <input
            className='outline-none focus-within:ring-2 p-4 rounded-md shadow-md dark:bg-slate-700'
            type='tel'
            placeholder='₹ Enter Your Professtion Tax Amount'
            onChange={handleChange}
            value={amount ? `₹ ${amount}` : ''}
            ref={inputRef}
          />
        </div>

        <label htmlFor='showAmt' className='flex items-center space-x-1.5'>
          <input
            type='checkbox'
            checked={isChecked}
            onChange={(e) => {}}
            id='showAmt'
            className='outline-none'
            onClick={() => setIsChecked(!isChecked)}
          />
          <span>
            {isChecked
              ? 'Apply to every month.'
              : `Apply to ${[month]} month only.`}
          </span>
        </label>

        <button
          type='submit'
          className='col-span-2 mx-auto bg-slate-700 px-4 py-2 rounded-md shadow-md text-white'
        >
          Submit
        </button>
      </form>

      {isChecked && (
        <motion.section
          variants={{
            initial: {
              opacity: 0,
            },
            animate: {
              opacity: 1,
            },
          }}
          initial='initial'
          animate='animate'
          className='flex flex-col items-center my-5'
        >
          {Object.keys(taxRates).map((key) => (
            <div key={key} className='flex space-x-2 gap-3 mb-2'>
              <span className='w-20'>{key}</span>
              <span>:</span>
              <input
                className='w-20 px-3 py-0.5 rounded-md shadow-md outline-none bg-slate-800 focus:ring-2'
                type='tel'
                onChange={handleChange}
                value={isChecked ? amount : taxRates[key]}
              />
              <button>
                <PencilSquareIcon className='w-5 text-blue-500' />
              </button>
            </div>
          ))}
        </motion.section>
      )}
    </>
  );
}
