import { featureRequest } from '@/apis/feedbacks';
import { msgSchema } from '@/lib/yup';
import { formTypes } from '@/utils/constants';
import { BugAntIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useMutation } from '@tanstack/react-query';
import { Formik } from 'formik';
import { useEffect, useRef, useState } from 'react';
import MyModal from './HeadlessUI/Modal';

export default function BugReport() {
  const [isOpen, setIsOpen] = useState(false);
  const closeModal = () => {
    setIsOpen(false);
  };
  return (
    <>
      <button
        className='flex w-48 place-content-center rounded-md bg-rose-400 px-3 py-2.5 text-center font-semibold text-slate-900 shadow-md'
        onClick={() => setIsOpen(!isOpen)}
      >
        <BugAntIcon className='mr-1 w-7' />
        <span>Bug Report</span>
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
  const mutation = useMutation({
    mutationKey: 'bugReport',
    mutationFn: (payload) => {
      return featureRequest(payload, closeModal);
    },
  });
  const inputRef = useRef(null);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <Formik
      initialValues={{ msg: '' }}
      validationSchema={msgSchema}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          mutation.mutate({ formType: formTypes.bug, msg: values.msg });

          setSubmitting(false);
        }, 400);
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
        /* and other goodies */
      }) => (
        <form
          className='-mt-3 flex flex-col gap-y-3 px-2 py-3 text-gray-900 dark:text-white'
          onSubmit={handleSubmit}
        >
          <h1 className='text-lg font-bold'>
            <span className='inline-flex items-center gap-x-1.5'>
              <BugAntIcon className='w-7' />
              Bug Report
            </span>
            <button onClick={closeModal}>
              <XMarkIcon className='absolute right-3 top-3 w-8' />
            </button>
          </h1>
          <div className='relative'>
            <textarea
              ref={inputRef}
              name='msg'
              rows='3'
              placeholder='Enter Your Message.'
              className={`w-full rounded-md bg-slate-100 px-5 py-3 shadow-md outline-none focus:ring-2 dark:bg-slate-950/40 ${errors.msg && 'outline-red-600 focus-visible:ring-0'}`}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.msg}
            />
            {errors.msg && touched.msg && (
              <span className='absolute -bottom-4 right-1 text-xs font-semibold text-red-600'>
                {errors.msg}
              </span>
            )}
          </div>
          <button
            type='submit'
            disabled={mutation.isPending || isSubmitting}
            className={`order-1 col-span-2 mx-auto mt-3 w-28 rounded-md bg-blue-700 px-4 py-2 font-bold text-white shadow-md disabled:cursor-not-allowed dark:bg-blue-500 ${mutation.isPending && 'flex place-items-center'}`}
          >
            {mutation.isPending && (
              <svg
                className='-ml-1 mr-3 h-5 w-5 animate-spin text-white'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
              >
                <circle
                  className='opacity-25'
                  cx='12'
                  cy='12'
                  r='10'
                  stroke='currentColor'
                  strokeWidth='4'
                ></circle>
                <path
                  className='opacity-75'
                  fill='currentColor'
                  d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                ></path>
              </svg>
            )}
            Submit
          </button>
        </form>
      )}
    </Formik>
  );
}
