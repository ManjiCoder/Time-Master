export default function Admin() {
  return (
    <main
      className={`flex min-h-screen flex-col gap-y-5 bg-slate-300 py-5 pb-10 text-slate-800 dark:bg-slate-900 dark:text-white`}
    >
      <h1 className='text-center text-2xl font-semibold'>
        MasterTime - Feedbacks
      </h1>

      <div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
        <table className='mx-auto w-11/12 text-left text-sm text-gray-500 dark:text-gray-400 rtl:text-right'>
          <thead className='bg-gray-50 text-xs uppercase text-gray-700 dark:bg-slate-800 dark:text-gray-400'>
            <tr>
              <th scope='col' className='px-6 py-3'>
                Sr No
              </th>
              <th scope='col' className='px-6 py-3'>
                <div className='flex items-center'>Type</div>
              </th>
              <th scope='col' className='px-6 py-3'>
                <div className='flex items-center'>Message</div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className='bg-white dark:border-gray-700 dark:bg-slate-950/50'>
              <th
                scope='row'
                className='whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white'
              >
                Apple MacBook
              </th>
              <td className='px-6 py-4'>Silver</td>
              <td className='px-6 py-4'>Laptop</td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  );
}
