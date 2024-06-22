export default function Admin({ feedbacks }) {
  return (
    <main
      className={`flex min-h-screen flex-col gap-y-5 bg-slate-300 py-5 pb-20 text-slate-800 dark:bg-slate-900 dark:text-white`}
    >
      <h1 className='text-center text-2xl font-semibold'>
        MasterTime - Feedbacks
      </h1>

      <div className='relative overflow-x-auto'>
        <table className='mx-auto w-11/12 text-left text-sm text-gray-700 dark:text-gray-400 rtl:text-right'>
          <thead className='border-b bg-slate-50 text-xs uppercase text-gray-800 dark:border-slate-500 dark:bg-slate-800 dark:text-gray-400'>
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
            {feedbacks.map(({ _id, formType, msg }, idx) => (
              <tr
                key={_id}
                className='border-b bg-slate-100 last:border-none dark:border-gray-700 dark:bg-slate-950/50'
              >
                <th scope='row' className='px-6 py-4'>
                  {++idx}
                </th>
                <td className='px-6 py-4'>{formType}</td>
                <td className='px-6 py-4'>{msg}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

// This function gets called at build time
export async function getStaticProps() {
  // Call an external API endpoint to get posts
  const res = await fetch(
    'https://mastertime.vercel.app/api/feedback?limit=100'
  );
  const data = await res.json();
  const feedbacks = data.feedbacks;
  // By returning { props: { posts } }, the Blog component
  // will receive `posts` as a prop at build time
  return {
    props: {
      feedbacks,
    },
  };
}
