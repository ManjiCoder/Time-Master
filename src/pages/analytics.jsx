import DynamicHead from '@/components/DynamicHead';
import { generateChartData } from '@/utils/chartsService';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import { useTheme } from 'next-themes';
import { Baloo_Bhai_2 } from 'next/font/google';
import { Bar } from 'react-chartjs-2';
import { useSelector } from 'react-redux';

const inter = Baloo_Bhai_2({ subsets: ['latin'] });

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  Tooltip,
  Title,
  Legend
);

export default function Analytics() {
  const attendance = useSelector((state) => state.attendance);
  const { year } = useSelector((state) => state.dateSlice);
  const { resolvedTheme } = useTheme();
  const isDarkTheme = resolvedTheme === 'dark';

  const chartData = generateChartData(attendance, year);

  const data = {
    labels: chartData.map(({ monthName }) => monthName.slice(0, 3)),
    datasets: [
      {
        label: 'Present',
        data: chartData.map(({ days }) => days),
        backgroundColor: isDarkTheme ? 'gold' : 'blue',
        borderRadius: 4,
      },
      {
        label: 'Absent',
        data: chartData.map(({ absentDays }) => absentDays),
        backgroundColor: 'tomato',
        borderRadius: 4,
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
