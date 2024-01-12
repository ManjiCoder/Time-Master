import {
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  format,
  parse,
} from "date-fns";

const officeHours = 9;
const officeMintues = officeHours * 60;
const officeSeconds = officeMintues * 60;
export const showPercentage = (secs) => {
  const percent = (secs / officeSeconds) * 100;
  const formattedPercent =
    percent % 1 === 0
      ? percent.toFixed(0)
      : percent.toFixed(2).replace(/\.?0+$/, "");
  return formattedPercent;
};

export const calculateTimeSpent = (login, logout) => {
  // console.log(login, logout)
  const loginTime = parse(login, "HH:mm", new Date());
  const logoutTime = logout ? parse(logout, "HH:mm", new Date()) : new Date();

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
    return timeLog[year][month][timeStamp].login;
  } catch (error) {
    return false;
  }
};

export const formattedTime = (timeStr) => {
  const parsedTime = parse(timeStr, "HH:mm", new Date());
  const formattedTime = format(parsedTime, "hh:mm a").toLowerCase();
  return formattedTime;
};
