import { formattedTime } from "@/utils/dateService";
import { format, getDate } from "date-fns";
import React from "react";
import { useSelector } from "react-redux";

export default function Attendance() {
  const attendance = useSelector((state) => state.attendance);

  return (
    <main className="bg-slate-300 text-slate-800 min-h-screen pb-10">
      {Object.keys(attendance).map((year) =>
        Object.keys(attendance[year]).map((month) =>
          Object.keys(attendance[year][month]).map((date) => {
            const obj = attendance[year][month][date];
            // console.log(obj);
            const loginTime = formattedTime(obj.login);
            const logoutTime = formattedTime(obj.logout);
            return (
              <section
                key={obj.date}
                className="h-36 md:h-44 w-full md:max-w-xl lg:max-w-2xl p-2 flex m-auto"
              >
                <div className="bg-cyan-800 w-[30%] flex flex-col items-center justify-center rounded-l-lg">
                  {/* <div className="text-xs md:text-xl font-bold mb-1 text-white">
               {day}
             </div> */}
                  <div className="bg-slate-50 w-[70%] rounded-tr-lg rounded-tl-lg h-6 mb-0.5 text-base font-bold grid place-items-center">
                    {format(obj.date, "EEEE")}
                  </div>
                  <div
                    className={`bg-slate-100 w-[70%] rounded-br-lg rounded-bl-lg h-16 grid place-items-center font-bold text-4xl `}
                  >
                    {getDate(obj.date)}
                  </div>
                </div>

                <div className="bg-slate-800 w-[70%] rounded-r-lg flex items-center justify-center text-whitefont-bold text-white flex-col relative p-2">
                  <div className="flex text-sm md:text-base md:pb-2">
                    <p>
                      <span className="font-semibold">
                        {format(obj.date, "dd-MMM-yyyy")}
                      </span>
                    </p>
                  </div>
                  <div className="flex text-center gap-1">
                    <div>
                      <div
                        className={`bg-slate-600 flex items-end w-[5rem] md:w-28 max-w-full text-center rounded-md shadow-md text-xl font-bold py-3 px-2 `}
                      >
                        {loginTime.slice(0,loginTime.length-3)}
                        <span className="ml-0.5 mb-1 text-xs">{loginTime.slice(-3)}</span>
                      </div>
                      <div className="w-[5rem] md:w-28 max-w-full rounded-md shadow-md font-semibold">
                        Login
                      </div>
                    </div>
                    <div>
                      <div
                        className={`bg-slate-600 flex items-end w-[5rem] md:w-28 max-w-full text-center rounded-md shadow-md text-xl font-bold py-3 px-2 `}
                      >
                       {logoutTime.slice(0,logoutTime.length-3)}
                       <span className="ml-0.5 mb-1 text-xs">{logoutTime.slice(-3)}</span>
                      </div>
                      <div className="w-[5rem] md:w-28 max-w-full rounded-md shadow-md font-semibold">
                        Logout
                      </div>
                    </div>
                    <div>
                      <div
                        className={`bg-slate-600 w-[5rem] md:w-28 max-w-full text-center rounded-md shadow-md text-xl font-bold py-3 px-2 `}
                      >
                        {obj?.hours}
                      </div>
                      <div className="w-[5rem] md:w-28 max-w-full rounded-md shadow-md font-semibold">
                        Time
                      </div>
                    </div>
                    <div className="ml-1 flex flex-col justify-between"></div>
                  </div>
                </div>
              </section>
            );
          })
        )
      )}
    </main>
  );
}
