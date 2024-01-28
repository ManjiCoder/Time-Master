import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import ListBoxMonths from "./ListBoxMonths";
import ListBoxYears from "./ListBoxYears";

const minRate = 0.9259259259259259;

export default function TimeSpentIndicator() {
  const attendance = useSelector((state) => state.attendance);
  const { year, month } = useSelector((state) => state.dateSlice);
  const years = Object.keys(attendance).reverse();

  // const [minsRate, setMinsRate] = useState(second)

  const [totalTimeSpent, setTotalTimeSpent] = useState({
    hrs: 0,
    mins: 0,
    days: 0,
  });

  // Calculate total hours when attendance changes
  const totalTimeObj = () => {
    let payload = {
      hrs: 0,
      mins: 0,
      days: 0,
    };

    try {
      Object?.keys(attendance[year][month]).filter((v, i, a) => {
        v = parseInt(v);
        if (attendance[year][month][v].present !== "-") {
          payload.days += 1;

          let timeInHrsMin = attendance[year][month][v].hours
            .split(":")
            .filter((v, i) => {
              v = parseInt(v);
              if (i === 0) {
                payload.hrs = payload.hrs + v;
              } else {
                payload.mins = payload.mins + v;
              }
            });
        }
      });
      return payload;
    } catch (error) {
      console.log("object");
      return payload;
    }
  };

  useEffect(() => {
    // Update the state with the total hours
    const data = totalTimeObj();
    setTotalTimeSpent(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attendance, year, month]);

  const { days, hrs, mins } = totalTimeSpent;
  const totalTimeSpendInMins = hrs * 60 + mins;
  const totalExpectedTimeSpendInMins = days * 9 * 60;
  const timeDiffMins = -(totalExpectedTimeSpendInMins - totalTimeSpendInMins);
  const totalMinsR = Math.abs(timeDiffMins % 60);
  const totalHrsR = parseInt(Math.abs(timeDiffMins / 60));
  const rawAvg = totalTimeSpendInMins / 60 / days;
  const avg = Math.floor(rawAvg * 100) / 100;

  // const expectedRs = getDaysInMonth(monthNameToIndex[month]) * 9 * 60 * minRate;
  // console.log(
  //   totalExpectedTimeSpendInMins * minRate -
  //     Math.round(totalTimeSpendInMins * minRate)
  // );
  return (
    <header className="sticky top-0 w-full z-10  p-2 text-lg text-center space-x-2 shadow-md indicator text-white flex  items-center justify-evenly">
      <h1 className="flex flex-1 justify-evenly items-center">
        {/* <span className="w-8 p-0.5 h-8 grid place-items-center text-sm font-semibold bg-white text-gray-900 rounded-full shadow-md">
          {days.toString().padStart(2, "0")}
        </span>{" "}
        <span className="text-sm ml-1">Days</span> */}
        <p
          className={`mx-2 text-[16px] font-bold ${
            Math.sign(timeDiffMins) === -1 ? "text-red-500" : "text-green-500"
          }`}
        >
          <span
            className={`${
              Math.sign(timeDiffMins) === -1 ? "text-red-500" : "text-green-500"
            } font-bold`}
          >
            {Math.sign(timeDiffMins) === -1 ? "- " : "+ "}
          </span>
          {totalHrsR > 0 && totalHrsR + "hr : "}
          {totalMinsR}min
        </p>
        {/* <span className="text-sm mr-1">Avg</span>
        <span className="w-8 p-0.5 h-8 grid place-items-center text-sm font-semibold bg-white text-gray-900 rounded-full shadow-md">
          {avg}
        </span>{" "} */}
        <p className="text-sm">
          Days: <span className="font-bold">{days}</span>
        </p>
        <p className="text-sm">
          Avg: <span className="font-bold">{avg}</span>
        </p>
      </h1>
      <ListBoxYears years={years} />
      <ListBoxMonths />
    </header>
  );
}
