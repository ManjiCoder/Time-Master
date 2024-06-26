import { deleteByDate, editByDate } from '@/redux/slices/attendanceSlice';
import { Dialog, Transition } from '@headlessui/react';
import { format } from 'date-fns';
import { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

export default function DeleteModal({ isOpen, setIsOpen }) {
  const attendance = useSelector((state) => state.attendance);
  const { isOfficeMode } = useSelector((state) => state.userSettings);
  const { year, month, targetDate } = useSelector((state) => state.dateSlice);
  const dispatch = useDispatch();

  function closeModal() {
    setIsOpen(false);
  }
  const handleDelete = () => {
    const targetDateData = attendance[year][month][targetDate];
    const editedData = {
      ...targetDateData,
      login: '-',
      logout: '-',
      hours: '-',
      present: '-',
      leave: '-',
    };

    if (targetDateData.remark !== undefined) {
      delete editedData.remark;
    }

    if (isOfficeMode && targetDate == new Date().setHours(0, 0, 0, 0)) {
      toast.warn('Disable Office Mode!');
      closeModal();
      return;
    }

    const payload = {
      year,
      month,
      date: targetDate,
      data: editedData,
    };
    // console.table(payload.data);
    dispatch(editByDate(payload));
    closeModal();
    toast.success('TimeLog Deleted Successfully!');
  };

  return (
    <>
      <Transition appear show={true} as={Fragment}>
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
                    Are you sure?
                  </Dialog.Title>
                  <h2 className='mb-4 text-center font-medium text-gray-900 dark:text-white'>
                    Do you want to delete the{' '}
                    {format(
                      attendance[year][month][targetDate].date,
                      'dd-MMM-yyyy'
                    )}{' '}
                    TimeLog?
                  </h2>

                  <div className='mt-4 flex w-full justify-evenly'>
                    <button
                      type='button'
                      className='inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-700 focus-visible:ring-offset-2'
                      onClick={handleDelete}
                    >
                      Yes,I&apos;m sure!
                    </button>
                    <button
                      type='button'
                      className='inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
                      // formAction={() => removeCard(deleteCard._id)}
                      onClick={closeModal}
                    >
                      No, cancel!
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
