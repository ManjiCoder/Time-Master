/*******
 * @Ocean_Salary_Calculation_Logic
 * @Example Salary = SalaryAmount - hoursLeft*(hourlyRate) - absentDays*(perDayRate) - taxRate
 ********/

export const calculateSalary = (
  salaryAmount,
  hoursLeft,
  absentDays,
  month,
  overTimeInHrs = 0,
  taxRates
) => {
  // if (workedDays === 0) return toast.warn('Oops'); // TODO
  const days = 28;
  const hours = 9;
  const overTimeMultiplyer = 1;
  const bufferTimeInMins = 30;

  const hourLeftInMins = 60 * hoursLeft;
  if (hourLeftInMins <= bufferTimeInMins) {
    hoursLeft = 0;
  }

  const perDayRate = salaryAmount / days;
  const hourlyRate = salaryAmount / days / hours;
  let salary =
    salaryAmount -
    hoursLeft * hourlyRate -
    absentDays * perDayRate -
    taxRates[month];
  if (overTimeInHrs > 0) {
    const overTimeAmount = overTimeInHrs * hourlyRate * overTimeMultiplyer;
    salary = salary + overTimeAmount;
  }
  return Math.round(salary);
};
