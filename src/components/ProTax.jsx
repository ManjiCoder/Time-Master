import { setMonthTax, setTaxRates } from '@/redux/slices/ProfessionalTax';
import { PencilSquareIcon, XMarkIcon } from '@heroicons/react/20/solid';
import { motion } from 'framer-motion';
import { useRef, useState } from 'react';
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
      <li className='flex items-center justify-start space-x-2 rounded-md border border-slate-400 bg-slate-200 px-4 py-4 shadow-md dark:bg-slate-800'>
        Professional Tax :<span className='ml-1 font-semibold' hidden></span>
        <span className='relative top-1.5 ml-2 text-center text-2xl font-bold leading-[0]'>
          *******
        </span>
        <button className='outline-none' type='button' onClick={toggleModal}>
          <PencilSquareIcon className='mb-1 w-5 text-blue-600' />
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
  const { taxRates } = useSelector((state) => state.proTax);
  const dispatch = useDispatch();
  const [amount, setAmount] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [editMonth, setEditMonth] = useState(null);
  const inputRef = useRef(null);
  const handleChange = (e) => {
    setAmount(formatNumber(e.target.value));
  };
  const handleEdit = (month) => {
    setEditMonth(month);
    setIsChecked(false);
    setAmount(taxRates[month]);
  };

  const handleSubmit = () => {
    try {
      const isAmtString = typeof amount === 'string';
      const amt = parseInt(isAmtString ? amount.replaceAll(',', '') : amount);
      const newTaxRates = {};
      Object.keys(taxRates).map((month) => {
        newTaxRates[month] = isChecked ? amt : taxRates[month];
      });
      if (editMonth) {
        dispatch(setMonthTax({ month: editMonth, amount: amt }));
      } else {
        dispatch(setTaxRates(newTaxRates));
      }
      toast.success(`Tax Updated Successfully!`);
    } catch (error) {
      console.log(error);
      toast.error('Some error occured! Please try after sometime.');
    } finally {
      closeModal();
    }
  };

  // useEffect(() => {
  //   inputRef.current.focus();
  // }, []);
  return (
    <>
      <button onClick={closeModal}>
        <XMarkIcon className='absolute right-4 top-5 w-7 text-xl text-gray-900 dark:text-white' />
      </button>
      <form
        className='flex flex-col items-center justify-evenly gap-4 text-gray-900 dark:text-white'
        onSubmit={handleSubmit}
      >
        <div className='time inline-flex flex-col items-center justify-center gap-2 rounded-md bg-slate-50 shadow-md dark:bg-slate-800'>
          <input
            className='rounded-md px-4 py-2.5 shadow-md outline-none focus-within:ring-2 dark:bg-slate-700'
            type='tel'
            placeholder='₹ Enter Your Tax Amount.'
            onChange={handleChange}
            value={amount ? `₹ ${amount}` : ''}
            ref={inputRef}
          />
        </div>

        <label htmlFor='showAmt' className='flex items-center space-x-1.5'>
          {!editMonth && (
            <input
              type='checkbox'
              checked={isChecked}
              onChange={(e) => {}}
              id='showAmt'
              className='outline-none'
              onClick={() => setIsChecked(!isChecked)}
            />
          )}
          {editMonth ? (
            <span>{editMonth} Month</span>
          ) : (
            <span>Apply to every month.</span>
          )}
        </label>

        <button
          type='submit'
          className='col-span-2 mx-auto rounded-md bg-slate-700 px-4 py-2 text-white shadow-md'
        >
          Submit
        </button>
      </form>

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
        className='my-5 flex flex-col items-center'
      >
        {Object.keys(taxRates).map((key, index) => (
          <motion.div
            key={key}
            className='mb-2 flex gap-3 text-gray-900 dark:text-white'
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
            transition={{
              delay: 0.07 * index,
            }}
          >
            <span className='w-20'>{key}</span>
            <span>:</span>
            <input
              className={`w-20 rounded-md px-3 py-0.5 shadow-md outline-none dark:bg-slate-800 ${
                editMonth === key && 'ring-2'
              }`}
              type='tel'
              readOnly
              value={
                isChecked
                  ? amount === ''
                    ? taxRates[key]
                    : amount
                  : taxRates[key]
              }
            />
            <button onClick={() => handleEdit(key)}>
              <PencilSquareIcon className='w-5 text-blue-500' />
            </button>
          </motion.div>
        ))}
      </motion.section>
    </>
  );
}
