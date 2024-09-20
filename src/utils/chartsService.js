import { isHolidays, monthNameToIndex } from './dateService';

export const generateChartData = (data, year) => {
  const payload = {};
  Object.keys(monthNameToIndex).map((monthName) => {
    const initialState = {
      monthName,
      days: 0,
      absentDays: 0,
    };
    payload[monthName] = initialState;
  });
  try {
    const months = Object.keys(data[year])
      .map((month) => monthNameToIndex[month])
      .sort((a, b) => a - b);

    months.forEach((month) => {
      const monthName = Object.keys(monthNameToIndex)[month];
      const attendance = {
        monthName,
        days: 0,
        absentDays: 0,
      };
      const monthlyRecords = Object.keys(data[year][monthName]);
      monthlyRecords.filter((timeStamp) => {
        timeStamp = parseInt(timeStamp);
        const isPresent = !['-'].includes(
          data[year][monthName][timeStamp].present
        );
        const isHoliday = isHolidays(
          new Date(timeStamp),
          new Date(timeStamp).getDate()
        );

        if (isPresent) {
          attendance.days += 1;
        } else if (!isHoliday) {
          attendance.absentDays += 1;
        }
      });

      payload[monthName] = attendance;
    });
  } catch (error) {}
  // console.table(payload);
  const sortedPayload = Object.values(payload).sort(
    (a, b) => monthNameToIndex[a] - monthNameToIndex - b
  );
  return sortedPayload;
};
