import React from 'react';
import { isHolidays, monthNameToIndex } from '@/utils/dateService';
import { useSelector } from 'react-redux';
import { differenceInMinutes, format, getDate, parse } from 'date-fns';
import { holidayDetails } from '@/pages/attendance';
import { toast } from 'react-toastify';

const ExportData = (props) => {
  const year = props.year;
  const month = Object.keys(monthNameToIndex)[props.month - 1] || props.month;
  const attendance = useSelector((state) => state.attendance);
  // const { year, month } = useSelector((state) => state.dateSlice);

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
    try {
      const jsonData = JSON.parse(JSON.stringify(attendance));
      let csvTitle = [];
      let csvDesc = [];
      const arr = Object.keys(jsonData[year][month])
        .sort((a, b) => parseInt(a) - parseInt(b))
        .map((date) => {
          const obj = jsonData[year][month][date];
          // For Holidays to be remark
          const parseDate = new Date(parseInt(date));
          const dayNum = getDate(parseDate);
          const isHoliday = isHolidays(parseDate, dayNum);

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
            obj.remark = obj.remark && obj.remark !== '' ? obj.remark : 'Leave';
          }
          // delete obj?.leave;
          delete obj?.isHoliday;

          let remark = obj.remark;
          // This will lead to Others - test to test in Remark
          // if (remark && remark.includes('Others - ')) {
          //   remark = remark.replaceAll('Others - ', '');
          // }
          if (isHoliday) {
            if (holidayDetails[parseInt(date)]) {
              remark = `Holiday - ${holidayDetails[parseInt(date)].desc}`;
            } else if (obj.remark && obj.remark !== '') {
              remark = `Holiday - ${
                obj.remark.includes('Holiday - ')
                  ? obj.remark.replaceAll('Holiday - ', '')
                  : obj.remark
              }`;
            } else {
              remark = 'Holiday';
            }
          }

          const isHours = obj?.hours !== '-';
          if (isHours) {
            const t1 = parse(obj.hours, 'HH:mm', new Date());
            const t2 = isHoliday
              ? new Date().setHours(0, 0, 0, 0)
              : parse('09:00', 'HH:mm', new Date());
            const diff = differenceInMinutes(t1, t2);
            obj.diff = JSON.stringify(diff);
          }

          // To replace - with ''
          let desc = `${format(
            parseInt(date),
            'EEE dd MMM'
          )},${obj.present.replace(/-/g, '')},${obj.hours.replace(/-/g, '')},${
            obj.diff || ''
          },${obj.login.replace(/-/g, '')},${obj.logout.replace(/-/g, '')},${
            remark || ''
          }`;
          desc = `${desc}\n`;
          csvDesc += desc;
        });

      csvTitle.splice(3, 0, 'difference');

      const csvData =
        csvTitle
          .map((v) => v.replace(v[0], v[0].toUpperCase()))
          .toString()
          .replace(',Leave', '') +
        ',Remarks \n' +
        csvDesc;
      // console.log(csvData);

      // Download CSV file
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `${month}-${year}-MasterTime.csv`;

      document.body.appendChild(a);
      a.click();

      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error('No Data Found');
    }
  };

  return (
    <button
      className='ml-2 w-24 bg-blue-700 px-3 font-bold text-sm py-2.5 rounded-md shadow-md text-white'
      onClick={downloadCSVFile}
    >
      {' '}
      Download
    </button>
  );
};

export default ExportData;
