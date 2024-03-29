/*******
 * @Ocean_Salary_Calculation_Logic
 * @Example Salary = SalaryAmount - hoursLeft*(hourlyRate) - absentDays*(perDayRate) - taxRate
 ********/

export const calculateSalary = (salaryAmount, hoursLeft, absentDays, month) => {
  const days = 28;
  const hours = 9;
  const taxRates = {};

  const perDayRate = salaryAmount / days;
  const hourlyRate = salaryAmount / days / hours;
  const salary =
    salaryAmount -
    hoursLeft * hourlyRate -
    absentDays * perDayRate -
    taxRates[month];
  return salary;
};
