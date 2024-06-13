import { msgSchema } from '@/lib/yup';
import { BugAntIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Formik } from 'formik';
import { useState } from 'react';
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
  return (
    <Formik
      initialValues={{ msg: '' }}
      validationSchema={msgSchema}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          alert(JSON.stringify(values, null, 2));
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
              <XMarkIcon className='absolute right-3 top-3 w-9' />
            </button>
          </h1>
          <div className='relative'>
            <textarea
              name='msg'
              cols='30'
              rows='3'
              placeholder='Enter Your Message.'
              className={`rounded-md bg-slate-100 px-5 py-3 shadow-md outline-none focus:ring-2 dark:bg-slate-950/40 ${errors.msg && 'outline-red-600'}`}
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
            disabled={isSubmitting}
            className='order-1 col-span-2 mx-auto mt-3 w-28 rounded-md bg-blue-700 px-4 py-2 font-bold text-white shadow-md dark:bg-blue-500'
          >
            Submit
          </button>
        </form>
      )}
    </Formik>
  );
}
