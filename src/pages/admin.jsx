import { api } from "@/lib/axiosInstance";

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

// This function gets called at every time
export async function getServerSideProps() {
  // Call an external API endpoint to get posts
  const { data } = await api.get('/api/feedbacks?limit=100');
  const feedbacks = data.feedbacks;
  // By returning { props: { posts } }, the Blog component
  // will receive `posts` as a prop at build time
  return {
    props: {
      feedbacks,
    },
  };
}
