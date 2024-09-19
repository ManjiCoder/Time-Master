import { monthNameToIndex } from '@/utils/dateService';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  Tooltip,
} from 'chart.js';
import { Baloo_Bhai_2 } from 'next/font/google';
import { Bar } from 'react-chartjs-2';

const inter = Baloo_Bhai_2({ subsets: ['latin'] });

const labels = Object.keys(monthNameToIndex).slice(0, 7);
const data = {
  labels: labels,
  datasets: [
    {
      label: 'My First Dataset',
      data: [24, 20, 15, 5],
      borderColor: 'rgb(75, 192, 192, 0.6)',
      backgroundColor: ['gold', 'lime', 'purple', 'tomato'],
    },
  ],
};

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);
export default function Analytics() {
  return (
    <main
      className={`min-h-screen bg-slate-300 pb-10 text-slate-800 dark:bg-slate-900 dark:text-white ${inter.className} p-4`}
    >
      Analytics
      <Bar
        options={{}}
        data={data}
        className='rounded-md p-3 dark:bg-slate-800'
      />
    </main>
  );
}
