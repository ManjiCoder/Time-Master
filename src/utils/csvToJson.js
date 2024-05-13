import { format } from 'date-fns';
const serverTimeDiff = 19800000;

export const csvToJSON = (year, csvData) => {
  const timeLog = {};
  const csvText = csvData.split('\n');
  const titles = csvText.shift().split(',');
  csvText.map((vl) => {
    let timeStamp;
    const payload = {};
    vl.split(',').map((v, i) => {
      if (i === 0) {
        timeStamp =
          new Date(new Date(`${v} ${year}`)).setHours(0, 0, 0, 0) -
          serverTimeDiff;
        payload.date = format(timeStamp, 'yyyy-MM-dd');
        // timeStamp = format(new Date(new Date(`${v} ${year}`)), 'yyyy-MM-dd');
        // payload.date = timeStamp;
      } else {
        let title = titles[i].toLowerCase().trim();
        title = title === 'remarks' ? 'remark' : title;
        payload[title] = v === '' ? '-' : v;
      }
    });

    delete payload.difference;
    timeLog[timeStamp] = payload;
  });

  Object.keys(timeLog).filter((key) => {
    if (Object.keys(timeLog[key]).length !== 6) {
      delete timeLog[key];
    } else {
      timeLog[key].leave = ['Leave', 'Floating Leave'].includes(
        timeLog[key].remark
      )
        ? '1'
        : '-';
      const isRemark = timeLog[key].remark === '-';
      if (isRemark) {
        delete timeLog[key].remark;
      }
      if (timeLog[key].remark === 'Holiday') {
        delete timeLog[key].remark;
      }
    }
  });
  return timeLog;
};

export const csvToJson = (year, csvData) => {
  const csvText = csvData.split('\n').filter((v) => v !== '');
  const titles = csvText.shift().toLowerCase().split(',');

  const timeLogs = {};
  csvText.map((str) => {
    const payload = {};
    let timeStamp = null;
    str.split(',').map((v, i) => {
      if (i === 0) {
        timeStamp = new Date(`${v}${year}`).setHours(0, 0, 0, 0);
        payload.date = format(new Date(`${v}${year}`), 'yyyy-MM-dd');
      } else {
        const title = titles[i]==='remarks':'remark':titles[i];
        payload[title] = v === '' ? '-' : v;
      }
    });
    timeLogs[timeStamp] = payload;
    timeStamp = null;
  });
  return timeLogs;
};
