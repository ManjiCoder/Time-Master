import DynamicHead from '@/components/DynamicHead';
import { generateChartData } from '@/utils/chartsService';
import { monthNameToIndex } from '@/utils/dateService';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
} from 'chart.js';
import { Baloo_Bhai_2 } from 'next/font/google';
import { Bar } from 'react-chartjs-2';
import { useSelector } from 'react-redux';

const inter = Baloo_Bhai_2({ subsets: ['latin'] });

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, Tooltip);

export default function Analytics() {
  const attendance = useSelector((state) => state.attendance);
  const { year } = useSelector((state) => state.dateSlice);
  const labels = Object.keys(monthNameToIndex).map((month) =>
    month.slice(0, 3)
  );
  const chartData = generateChartData(attendance, year);
  console.table(chartData);
  const data = {
    labels: chartData.map(({ monthName }) => monthName),
    datasets: [
      {
        // label: 'Full Year Attendace Representation.',
        data: chartData.map(({ days }) => days),
        backgroundColor: 'gold',
      },
    ],
  };
  return (
    <main
      className={`min-h-screen bg-slate-300 pb-10 text-slate-800 dark:bg-slate-900 dark:text-white ${inter.className} p-4`}
    >
      <DynamicHead>
        <title>Settings | MasterTime</title>
      </DynamicHead>
      <h2 className='px-4 text-2xl font-semibold'>Analytics</h2>

      <section className='mt-4'>
        <Bar
          options={{
            responsive: true,
          }}
          data={data}
          className='rounded-md bg-slate-100 p-3 dark:bg-slate-800'
        />
      </section>
    </main>
  );
}
