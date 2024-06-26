import { Dialog, Transition } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { Fragment, useRef } from 'react';

export default function MyModal({
  title,
  desc,
  closeModal,
  handleClick,
  children,
}) {
  const cancelButtonRef = useRef(null);
  return (
    <Transition.Root show as={Fragment}>
      <Dialog
        className='relative z-10'
        initialFocus={cancelButtonRef}
        onClose={closeModal}
      >
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-black bg-opacity-75 transition-opacity' />
        </Transition.Child>

        <div className='fixed inset-0 z-10 w-screen overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              enterTo='opacity-100 translate-y-0 sm:scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 translate-y-0 sm:scale-100'
              leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            >
              <Dialog.Panel className='relative w-11/12 transform overflow-hidden rounded-lg text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg'>
                <div
                  className={`bg-white px-4 pt-5 dark:bg-slate-900 sm:p-6 ${
                    children === undefined ? '' : 'pb-4 sm:pb-4'
                  }`}
                >
                  <div className='sm:flex sm:items-start'>
                    {children === undefined && (
                      <div className='mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10'>
                        <ExclamationTriangleIcon
                          className='h-6 w-6 text-red-600'
                          aria-hidden='true'
                        />
                      </div>
                    )}
                    <div
                      className={`mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left ${
                        children !== undefined && 'flex-1'
                      }`}
                    >
                      <Dialog.Title
                        as='h3'
                        className={`text-2xl font-semibold leading-6 text-gray-900 dark:text-white ${
                          children !== undefined && 'text-center'
                        }`}
                      >
                        {title}
                      </Dialog.Title>
                      <div className='mt-2 text-sm leading-relaxed text-gray-500 dark:text-slate-300'>
                        {desc}
                      </div>
                    </div>
                  </div>

                  {children !== undefined && children}
                </div>
                {children === undefined && (
                  <div className='bg-gray-50 px-4 py-3 dark:bg-slate-900 sm:flex sm:flex-row-reverse sm:px-6'>
                    <button
                      type='button'
                      className='inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto'
                      onClick={handleClick}
                    >
                      Delete
                    </button>
                    <button
                      type='button'
                      className='mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto'
                      onClick={closeModal}
                      ref={cancelButtonRef}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
