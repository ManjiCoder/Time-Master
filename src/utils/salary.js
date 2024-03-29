/*******
 * @Ocean_Salary_Calculation_Logic
 * @Example Salary = SalaryAmount - hoursLeft*(hourlyRate) - absentDays*(perDayRate) - taxRate
 ********/

import { toast } from 'react-toastify';

export const calculateSalary = (
  salaryAmount,
  hoursLeft,
  absentDays,
  month,
  workedDays
) => {
  // if (workedDays === 0) return toast.warn('Oops'); // TODO
  const days = 28;
  const hours = 9;
  const taxRates = {
    January: 200,
    February: 300,
    March: 200,
    April: 200,
    May: 200,
    June: 200,
    July: 200,
    August: 200,
    September: 200,
    October: 200,
    November: 200,
    December: 200,
  };

  const perDayRate = salaryAmount / days;
  const hourlyRate = salaryAmount / days / hours;
  const salary =
    salaryAmount -
    hoursLeft * hourlyRate -
    absentDays * perDayRate -
    taxRates[month];
  return salary;
};
