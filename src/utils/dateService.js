import {
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  format,
  parse,
} from 'date-fns';

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
  // console.log(percent, secs);
  return timeSpent;
};

export const isLoginTime = (year, month, timeStamp, timeLog) => {
  try {
    const loginTime = timeLog[year][month][timeStamp].login;
    return loginTime === '-' ? false : loginTime;
  } catch (error) {
    return false;
  }
};

export const formattedTime = (timeStr) => {
  // try {
  //   if (timeStr.includes('AM') || timeStr.includes('PM')) {
  //     return timeStr.toLowerCase();
  //   } else if (timeStr === '-') {
  //     return timeStr;
  //   }
  //   const parsedTime = parse(timeStr, 'hh:mm', new Date());
  //   const formattedTime = format(parsedTime, 'hh:mm a').toLowerCase();
  //   return formattedTime;
  // } catch (error) {
  //   return false;
  // }
  return timeStr;
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
  let startIndex = text.indexOf('Tour') + 5;
  let arr = text.slice(startIndex, text.length).split('\n');

  arr.map((str) => {
    let date = str.slice(0, 10).split('-').reverse().join('-');
    let present = str.slice(10, 11);
    let isPresent = present === '1';
    let amIndex = str.indexOf('AM') + 2;
    let pmIndex = str.indexOf('PM') + 2;
    let dateInTime = new Date(date).setHours(0, 0, 0, 0);
    let hours = isPresent ? str.slice(11, 16) : str.slice(11, 12);
    let isHoursEmpty = hours === '-';
    let login = str.includes('AM')
      ? str.slice(amIndex - 8, amIndex)
      : isHoursEmpty
      ? str.slice(13, 14)
      : str.slice(16, 17);
    let isLogin = str.includes('AM');
    let logout = str.includes('PM')
      ? str.slice(pmIndex - 8, pmIndex)
      : isLogin
      ? str.slice(amIndex, amIndex + 1)
      : str.slice(17, 18);
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
    // console.log(str);

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
      year = format(Number(dateInTime), 'yyyy');
      month = format(Number(dateInTime), 'MMMM');
    }
  });
  const payload = {
    year,
    month,
    data: userTimeLog,
  };
  return payload;
}
