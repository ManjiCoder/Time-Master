import {
  addMinutes,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  format,
  getDaysInMonth,
  isSaturday,
  isSunday,
  isValid,
  parse,
} from 'date-fns';
import { holidayDetails, remarkObj } from './constants';

const officeHours = 9;
const officeMintues = officeHours * 60;
const officeSeconds = officeMintues * 60;
export const showPercentage = (secs) => {
  const percent = (secs / officeSeconds) * 100;
  const formattedPercent =
    percent % 1 === 0
      ? percent.toFixed(0)
      : percent.toFixed(2).replace(/\.?0+$/, '');
  return formattedPercent;
};

export const calculateTimeSpent = (login, logout) => {
  try {
    // console.log(login, logout)
    const loginTime = parse(login, 'HH:mm', new Date());
    const logoutTime = logout ? parse(logout, 'HH:mm', new Date()) : new Date();

    const hrs = differenceInHours(logoutTime, loginTime);
    const mins = differenceInMinutes(logoutTime, loginTime);
    const secs = differenceInSeconds(
      logoutTime.setSeconds(new Date().getSeconds()),
      loginTime
    );

    const percent = showPercentage(secs);
    const timeSpent = {
      hrs,
      mins: mins % 60,
      secs: new Date().getSeconds(),
      percent,
    };
    // // TODO: Set on time
    // if (timeSpent.hrs === 9 && timeSpent.mins === 0 && timeSpent.secs === 0) {
    //   try {
    //     new Notification('Jai Shree Ram', {
    //       body: 'test',
    //       icon: '/favicon.ico',
    //       vibrate: 500,
    //     });
    //   } catch (error) {}
    // }
    // console.log(percent, secs);
    return timeSpent;
  } catch (error) {
    return false;
  }
};

export const isLoginTime = (year, month, timeStamp, timeLog) => {
  try {
    const loginTime = timeLog[year][month][timeStamp].login;
    return loginTime === '-' ? false : loginTime;
  } catch (error) {
    return false;
  }
};
export const isLogoutTime = (year, month, timeStamp, timeLog) => {
  try {
    const logoutTime = timeLog[year][month][timeStamp].logout;
    return logoutTime === '-' ? false : logoutTime;
  } catch (error) {
    return false;
  }
};

export const formattedTime24 = (timeStr) => {
  try {
    if (timeStr.includes('AM')) {
      return timeStr.replace(' AM', '').trim();
    } else if (timeStr === '-') {
      return timeStr;
    }
  } catch (error) {
    return timeStr;
  }
};
export const formattedTime12 = (timeStr) => {
  try {
    if (timeStr.includes('AM') || timeStr.includes('PM')) {
      return timeStr;
    } else if (timeStr === '-') {
      return timeStr;
    }
    const parsedTime = parse(timeStr, 'HH:mm', new Date());
    const formattedTime = format(parsedTime, 'hh:mm a');
    // console.log({ parsedTime, formattedTime });
    return formattedTime;
  } catch (error) {
    return timeStr;
  }
};

export const format24To12 = (timeStr) => {
  try {
    if (timeStr.includes('pm') || timeStr.includes('am')) {
      return timeStr;
    }
    const parsedTime = parse(timeStr, 'HH:mm', new Date());
    const formattedTime = format(parsedTime, 'hh:mm a');
    return formattedTime;
  } catch (error) {
    return timeStr;
  }
};

export const removeAMorPM = (timeStr) => {
  try {
    timeStr = timeStr.toLowerCase();
    // let index;
    if (timeStr.includes('am')) {
      // index = timeStr.indexOf("am");
      const parsedTime = parse(timeStr, 'hh:mm a', new Date());
      const formattedTime = format(parsedTime, 'HH:mm');
      // console.log(formattedTime, timeStr);
      return formattedTime;
    } else {
      // index = timeStr.indexOf("pm");
      const parsedTime = parse(timeStr, 'hh:mm a', new Date());
      const formattedTime = format(parsedTime, 'HH:mm');
      // console.log(formattedTime, timeStr);
      return formattedTime;
    }
    // const result = index !== -1 ? timeStr.slice(0, index).trim() : timeStr;
    // // console.log(result);
    // return result;
  } catch (error) {
    return timeStr;
  }
};

export const getUsersInfoText = (txt) => {
  let userInfo = {};
  let year;
  let month;

  let startIndex = txt.indexOf('Tour');
  txt = txt.substring(startIndex + 4, txt.length);
  let arr = txt.split('\n');

  let newArr = [];
  // To remove unnessary string
  arr.map((v) => {
    if (v !== '' && v !== ' ') {
      newArr.push(v);
    }
  });
  // To combine all field in userInfo
  for (let i = 0; i < newArr.length; i += 8) {
    let obj = {
      date: '',
      present: '',
      hours: '',
      login: '',
      logout: '',
      leave: '',
      break: '',
      tour: '',
    };
    newArr.slice(i, i + 8).map((v, index) => {
      let key = Object.keys(obj)[index];
      obj[key] = v;
    });
    let dateStr = obj.date.split('-').reverse();
    parseInt(dateStr[1]) - 1;
    dateStr = new Date(dateStr.join(',')).getTime();

    if (!Number.isNaN(dateStr)) {
      userInfo[dateStr] = obj;
      year = format(Number(dateStr), 'yyyy');
      month = format(Number(dateStr), 'MMMM');
    }
  }
  const payload = {
    year,
    month,
    data: userInfo,
  };
  // console.log(userInfo)
  return payload;
};

export function getUserInfo(text) {
  let userTimeLog = {};
  let year;
  let month;
  let name = '';
  try {
    let nameStart = text.indexOf('User Name: ');
    let nameEnd = text.indexOf('Attendance Date: ');
    name = text
      .slice(nameStart, nameEnd)
      .replace('User Name: ', '')
      .split(' ')[0];
    let startIndex = text.indexOf('Tour') + 5;
    let arr = text.slice(startIndex, text.length).split('\n');

    arr.map((str) => {
      let date = str.slice(0, 10).split('-').reverse().join('-');

      if (!isValid(new Date(date))) {
        throw new Error('Invalid Date');
      }

      const isHalfDay = str.includes('0.5');
      let present = str.slice(10, isHalfDay ? 13 : 11);
      let isPresent = present === '1';
      let amIndex = str.indexOf('AM') + 2;
      let pmIndex = str.indexOf('PM') + 2;
      let amLastIndex = str.lastIndexOf('AM') + 2;
      let pmLastIndex = str.lastIndexOf('PM') + 2;
      const isBothAM = str.toUpperCase().match(/AM/g);
      const isBothPM = str.toUpperCase().match(/PM/g);
      let dateInTime = new Date(date).setHours(0, 0, 0, 0);
      // let dateInTime = format(new Date(date), 'yyyy-MM-dd');
      // let hours = isPresent ? str.slice(11, 16) : str.slice(11, 12);
      // let isHoursEmpty = hours === '-';

      let login;
      if (str.includes('AM')) {
        login = str.slice(amIndex - 8, amIndex);
      } else if (isBothPM && isBothPM.length === 2) {
        login = str.slice(pmIndex - 8, pmIndex);
      } else if (isBothAM && isBothAM.length === 2) {
        login = str.slice(amIndex - 8, amIndex);
      } else {
        login = '-';
      }

      let logout;
      if (str.includes('PM')) {
        logout = str.slice(pmLastIndex - 8, pmLastIndex);
      } else if (isBothAM && isBothAM.length === 2) {
        logout = str.slice(amLastIndex - 8, amLastIndex);
      } else if (isBothPM && isBothPM.length === 2) {
        logout = str.slice(pmLastIndex - 8, pmLastIndex);
      } else {
        logout = '-';
      }

      let hours =
        login !== '-' && logout !== '-' ? str.slice(11, 16) : str.slice(11, 12);
      if (isHalfDay) {
        hours = str.slice(13, 18);
      }
      let indexOfZero = str.lastIndexOf('00:00');
      let leave =
        indexOfZero === -1
          ? str.slice(-3)[0]
          : str.slice(indexOfZero - 1, indexOfZero);
      let breakTime =
        indexOfZero === -1
          ? str.slice(-2)[0]
          : str.slice(indexOfZero, indexOfZero + 5);
      let tour = str.slice(-1);
      let remark = null;
      // console.log(str);

      if (isHalfDay) {
        const a = str.indexOf('0.5');
        const b = str.lastIndexOf('0.5');
        // This is confirms that user is taking halfDay leave
        if (b !== 10) {
          if (a === 10) {
            hours = str.slice(13, 18);
          } else {
            hours = str.slice(11, 16);
          }
          leave = '0.5';
          remark = remarkObj.halfDayLeave;
          const isLogin = login !== '-';
          const isLogout = logout !== '-';
          if (isLogin && isLogout) {
            const time = parse(hours, 'HH:mm', new Date());
            const totalTime = addMinutes(time, 4 * 60 + 30);
            const diffInMin = differenceInMinutes(
              totalTime,
              new Date().setHours(9, 0, 0, 0)
            );
            if (diffInMin > 0) {
              hours = '09:00';
            } else {
              const hoursTime = format(totalTime, 'HH:mm');
              hours = hoursTime;
            }
            present = '1';
          } else {
            login = '10:00 AM';
            logout = '02:30 PM';
            hours = '04:30';
            present = '0.5';
          }
        }
      }
      if (!Number.isNaN(dateInTime)) {
        userTimeLog[dateInTime] = {
          date,
          present,
          hours,
          login,
          logout,
          leave,
          break: breakTime,
          tour,
        };
        if (userTimeLog[dateInTime].leave === '1') {
          userTimeLog[dateInTime].login = '09:00 AM';
          userTimeLog[dateInTime].logout = '06:00 PM';
          userTimeLog[dateInTime].hours = '09:00';
        }
        if (remark) {
          userTimeLog[dateInTime].remark = remark;
        }
        year = format(Number(dateInTime), 'yyyy');
        month = format(Number(dateInTime), 'MMMM');
      }
    });
    const payload = {
      year,
      month,
      name,
      data: userTimeLog,
    };
    payload.data = getTimeLogs(year, monthNameToIndex[month], userTimeLog);
    return payload;
  } catch (error) {
    return {
      year,
      month,
      name,
      data: {},
    };
  }
}

export function getTimeLogs(year, month, data) {
  const newTimeLog = {};
  const n = getDaysInMonth(new Date(year, month));
  const defaultTimeLog = {
    date: '-',
    present: '-',
    hours: '-',
    login: '-',
    logout: '-',
    leave: '-',
    break: '-',
    tour: '-',
  };

  for (let i = 1; i <= n; i++) {
    const timeStamp = new Date(year, month, i).setHours(0, 0, 0, 0);
    if (data[timeStamp]) {
      newTimeLog[timeStamp] = data[timeStamp];
    } else {
      const date = format(timeStamp, 'yyyy-MM-dd');
      newTimeLog[timeStamp] = { ...defaultTimeLog, date };
    }
  }
  return newTimeLog;
}

export const monthNameToIndex = {
  January: 0,
  February: 1,
  March: 2,
  April: 3,
  May: 4,
  June: 5,
  July: 6,
  August: 7,
  September: 8,
  October: 9,
  November: 10,
  December: 11,
};

export function getHolidaysList(str) {
  let holidays = {};
  let year = str.indexOf('year');
  year =
    year !== -1
      ? str
          .slice(year, year + 10)
          .replace('year', '')
          .trim()
      : new Date().getFullYear().toString();
  let startIndex = str.indexOf('DateDayHolidays');
  let endIndex = str.lastIndexOf('DateDayHolidays');
  let filterArr = str
    .slice(startIndex, endIndex)
    .trim()
    .split('\n')
    .filter((v) => v.includes('-'));
  let arr = filterArr.map((v) => {
    const parsedDate = parse(
      v.slice(0, v.indexOf(year) + 4),
      'dd-MMM-yyyy',
      new Date()
    );
    holidays[parsedDate.setHours(0, 0, 0, 0)] = format(
      parsedDate,
      'dd-MMM-yyyy'
    );
    // return parsedDate.getTime();
  });
  return holidays;
}

export const isHolidays = (parseDate, dayNum) => {
  try {
    return (
      (isSaturday(parseDate) &&
        (dayNum <= 7 || (dayNum > 14 && dayNum <= 21))) ||
      isSunday(parseDate) ||
      holidayDetails[new Date(parseDate).setHours(0, 0, 0, 0)].desc !==
        undefined
    );
  } catch (error) {
    return false;
  }
};

export const parsedTime = (timeStr) => {
  return parse(timeStr, 'HH:mm', new Date()).getTime();
};

export const isValidTime = (loginTime, logoutTime) => {
  return Math.sign(parsedTime(logoutTime) - parsedTime(loginTime)) === -1;
};

export const generateFullMonthDates = (mm, yyyy) => {
  console.log(mm, yyyy);
};
