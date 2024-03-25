import React from 'react';
import { isHolidays } from '@/utils/dateService';
import { useSelector } from 'react-redux';
import { getDate } from 'date-fns';

const ExportData = () => {
  const attendance = useSelector((state) => state.attendance);
  const { year, month } = useSelector((state) => state.dateSlice);

  const downloadJSONFile = () => {
    const jsonData = attendance;

    const jsonContent = JSON.stringify(jsonData, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'MasterTime.json';

    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadCSVFile = () => {
    // // Function to convert JSON to CSV
    // const jsonToCSV = (data) => {
    //   const headers = Object.keys(data[0]).join(','); // Extract headers

    //   const rows = data.map((obj) =>
    //     Object.values(obj)
    //       .map((val) => `"${val}"`) // Enclose values in double quotes to handle commas in values
    //       .join(',')
    //   );

    //   return `${headers}\n${rows.join('\n')}`;
    // };
    const jsonData = JSON.parse(JSON.stringify(attendance));
    let csvTitle = '';
    let csvDesc = [];
    const arr = Object.keys(jsonData[year][month])
      .sort((a, b) => parseInt(a) - parseInt(b))
      .map((date) => {
        const obj = jsonData[year][month][date];
        // Clean UP
        delete obj?.break;
        delete obj?.isLeave;
        delete obj?.tour;
        // console.log(obj)
        // For getting Titles
        if (csvTitle !== Object.keys(jsonData[year][month][date])) {
          csvTitle = Object.keys(jsonData[year][month][date]);
        }

        // For Half Day
        if (obj.present === '0.5') {
          obj.remark = 'Half Day';
        }

        // For Leave
        if (obj.leave === '1') {
          obj.login = '09:00 AM';
          obj.logout = '06:00 PM';
          obj.hours = '09:00';
          obj.present = '1';
          obj.remark ||= 'Leave';
        }
        delete obj?.leave;
        delete obj?.isHoliday;
        // For Holidays to be remark
        const parseDate = new Date(parseInt(date));
        const dayNum = getDate(parseDate);
        if (isHolidays(parseDate, dayNum)) {
          obj.remark = 'Holiday';
        }

        // To replace - with ''
        let desc = Object.values(jsonData[year][month][date]);
        let temp = desc.shift();
        desc = `${temp},${desc.toString().replace(/-/g, '')}\n`;
        csvDesc += desc;
      });

    const csvData =
      csvTitle
        .map((v) => v.replace(v[0], v[0].toUpperCase()))
        .toString()
        .replace(',Leave', '') +
      ',Remarks \n' +
      csvDesc;
    // console.log(csvTitle);

    // Download CSV file
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `MasterTime-${month}-${year}.csv`;

    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <button
      className='ml-2 bg-blue-700 px-3 font-bold text-sm py-1.5 rounded-md shadow-md text-white'
      onClick={downloadCSVFile}
    >
      {' '}
      Download
    </button>
  );
};

export default ExportData;
