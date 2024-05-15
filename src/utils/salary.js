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

  // const taxRates = {
  //   January: 200,
  //   February: 300,
  //   March: 200,
  //   April: 200,
  //   May: 200,
  //   June: 200,
  //   July: 200,
  //   August: 200,
  //   September: 200,
  //   October: 200,
  //   November: 200,
  //   December: 200,
  // };

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
  return salary;
};
