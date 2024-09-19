import { monthNameToIndex } from './dateService';

export const generateChartData = (data, year) => {
  const payload = new Set();
  const months = Object.keys(data[year])
    .map((month) => monthNameToIndex[month])
    .sort((a, b) => a - b);

  months.forEach((month) => {
    const monthName = Object.keys(monthNameToIndex)[month];
    const attendance = {
      monthName,
      days: 0,
    };
    const monthlyRecords = Object.keys(data[year][monthName]);
    monthlyRecords.filter((timeStamp) => {
      const isPresent = !['-'].includes(
        data[year][monthName][timeStamp].present
      );
      if (isPresent) {
        attendance.days += 1;
      }
    });
    payload.add(attendance);
  });
  return Array.from(payload);
};
