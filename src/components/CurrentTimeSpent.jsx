import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { setLogin } from "../redux/slices/attendanceSlice";
import { format } from "date-fns";
import { calculateTimeSpent } from "@/utils/dateService";

export default function CurrentTimeSpent({ loginTime, logoutTime }) {
  const attendance = useSelector((state) => state.attendance);
  const [timeSpent, seTimeSpent] = useState({
    hrs: 0o0,
    mins: 0o0,
    secs: 0o0,
    percent: 0o0,
  });
  const { isOfficeMode } = useSelector((state) => state.userSettings);
  // const currentDate = attendance[currentDateStr];
  const dispatch = useDispatch();
  // console.log(attendance);

  useEffect(() => {
    if (loginTime.length !== 0 && isOfficeMode) {
      let intervalId = setInterval(() => {
        const currentDate = new Date();
        const year = format(currentDate, "yyyy");
        const month = format(currentDate, "MMMM");
        const date = currentDate.setHours(0, 0, 0, 0);
        const logout = isOfficeMode ? format(new Date(), "HH:mm") : logoutTime;
        let timeSpendPayload = calculateTimeSpent(loginTime, logout);
        seTimeSpent(timeSpendPayload);
        const payload = {
          date: currentDate.toISOString(),
          login: loginTime,
          logout,
          hours: `${timeSpendPayload.hrs
            .toString()
            .padStart(2, "0")}:${timeSpendPayload.mins
            .toString()
            .padStart(2, "0")}`,
        };
        if (loginTime !== "") {
          dispatch(
            setLogin({
              year,
              month,
              date,
              [date]: payload,
            })
          );
        }

        // console.log(timeSpendPayload.percent);
      }, 1000);
      // console.log({ intervalId });

      // Clean up
      return () => {
        clearInterval(intervalId);
      };
    }
    if (loginTime.length !== 0 && loginTime.length !== 0 && !isOfficeMode) {
      let timeSpendPayload = calculateTimeSpent(loginTime, logoutTime);
      seTimeSpent(timeSpendPayload);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOfficeMode, loginTime, logoutTime]);

  if (loginTime.length === 0) {
    return (
      <p className="text-red-700 text-sm capitalize">
        Select the time first & then try again!
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* <h2 className="text-lg">
        Your current time spend:{" "}
        <b className="text-red-600">
          {`${timeSpent?.hrs} hrs ${timeSpent?.mins} mins ${timeSpent?.secs} sec`}
        </b>
      </h2> */}

      <section className="grid place-items-center">
        <svg
          className="fill-none -rotate-90 scale-90 "
          height={300}
          width={300}
        >
          <circle
            className="stroke-slate-700"
            cx={150}
            cy={150}
            r={135}
            strokeWidth={12}
          ></circle>
          <circle
            className="stroke-green-600 transition-all duration-500 ease-in-out"
            cx={150}
            cy={150}
            r={135}
            strokeDasharray={848}
            strokeLinecap="round"
            style={{
              strokeDashoffset: `calc(848 - (848 * ${
                timeSpent?.percent > 100 ? 100 : Math.floor(timeSpent.percent)
              }) / 100)`,
            }}
            strokeWidth={16}
          ></circle>
        </svg>
        <div className="absolute text-center justify-center items-center flex flex-col">
          <span className="text-4xl font-semibold mt-9">
            {timeSpent?.percent}
            <span className="text-3xl pb-2">%</span>
            {/* <sub>{timeSpent.secs}</sub> */}
          </span>

          <span className="text-sm text-green-900">
            {`+${timeSpent?.hrs} hr : ${timeSpent?.mins} min `}
          </span>
          {timeSpent?.hrs <= 8 && (
            <span className="text-sm text-red-900">
              {`${-(8 - timeSpent?.hrs) + " hr"} : ${
                60 - timeSpent?.mins + " min "
              }`}
            </span>
          )}
        </div>
      </section>
    </div>
  );
}
