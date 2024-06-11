import { setMinRate, setSalaryAmount } from '@/redux/slices/UserSettings';
import { toggleIsShowAmt } from '@/redux/slices/dateSlice';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/20/solid';
import { Fragment, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

export const formatNumber = (value) => {
  value = String(value);
  try {
    // Remove non-numeric characters
    const numericValue = value.replace(/\D/g, '');
    // Format with commas
    const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    // Add rupee sign
    return formattedValue;
  } catch (error) {
    return value;
  }
};

export default function EditAmountModal({ isOpen, setIsOpen }) {
  const dispatch = useDispatch();
  const { salaryAmount } = useSelector((state) => state.userSettings);
  const [salaryAmt, setSalaryAmt] = useState(formatNumber(salaryAmount));
  const inputRef = useRef(null);

  function closeModal() {
    setIsOpen(false);
    dispatch(toggleIsShowAmt());
  }

  const handleEdit = () => {
    dispatch(setSalaryAmount(parseFloat(salaryAmt.replace(/,/g, ''))));
    dispatch(setMinRate(salaryAmt / 30 / 9 / 60));
    closeModal();
    toast.success('Salary Amount Updated Successfully!');
  };

  const handleChange = (e) => {
    setSalaryAmt(formatNumber(e.target.value));
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
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
                <Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-slate-800'>
                  <Dialog.Title
                    as='h3'
                    className='mb-3 text-center text-2xl font-medium leading-6 text-gray-900 dark:text-white'
                  >
                    Set Your Salary Amount.
                  </Dialog.Title>
                  <button onClick={closeModal}>
                    <XMarkIcon className='absolute right-4 top-5 w-7 text-xl text-gray-900 dark:text-white' />
                  </button>
                  {/* <h2 className="text-center font-medium mb-4 text-gray-900">
                    Do you want to delete the TimeLog?
                  </h2> */}
                  <form
                    className='my-5 flex flex-col items-center justify-evenly gap-4 text-gray-900 dark:text-white'
                    onSubmit={handleEdit}
                  >
                    <div className='time inline-flex flex-col items-center justify-center gap-2 rounded-md bg-slate-50 shadow-md dark:bg-slate-800'>
                      <input
                        className='rounded-md p-4 shadow-md outline-none focus-within:ring-2 dark:bg-slate-700'
                        type='tel'
                        placeholder='₹ Enter your salary amount'
                        onChange={handleChange}
                        value={salaryAmt ? `₹ ${salaryAmt}` : ''}
                        ref={inputRef}
                      />
                    </div>

                    <button
                      type='submit'
                      className='col-span-2 mx-auto rounded-md bg-slate-700 px-4 py-2 text-white shadow-md'
                    >
                      Submit
                    </button>
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
