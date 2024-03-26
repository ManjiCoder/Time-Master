import { setMinRate, setSalaryAmount } from '@/redux/slices/UserSettings';
import { toggleIsShowAmt } from '@/redux/slices/dateSlice';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/20/solid';
import { Fragment, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const formatNumber = (value) => {
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
                <Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-slate-800 p-6 text-left align-middle shadow-xl transition-all'>
                  <Dialog.Title
                    as='h3'
                    className='text-2xl font-medium text-center mb-3 leading-6 text-gray-900 dark:text-white'
                  >
                    Set Your Salary Amount.
                  </Dialog.Title>
                  <button onClick={closeModal}>
                    <XMarkIcon className='absolute top-5 right-4 w-7 text-gray-900 dark:text-white text-xl' />
                  </button>
                  {/* <h2 className="text-center font-medium mb-4 text-gray-900">
                    Do you want to delete the TimeLog?
                  </h2> */}
                  <form
                    className='flex flex-col text-gray-900 dark:text-white my-5 gap-4 justify-evenly items-center'
                    onSubmit={handleEdit}
                  >
                    <div className='time inline-flex flex-col justify-center items-center gap-2 rounded-md shadow-md bg-slate-50 dark:bg-slate-800'>
                      <input
                        className='outline-none focus-within:ring-2 p-4 rounded-md shadow-md dark:bg-slate-700'
                        type='tel'
                        placeholder='Enter your salary amount'
                        onChange={handleChange}
                        value={'₹' + salaryAmt || ''}
                      />
                    </div>

                    <button
                      type='submit'
                      className='col-span-2 mx-auto bg-slate-700 px-4 py-2 rounded-md shadow-md text-white'
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
