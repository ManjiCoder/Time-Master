import { Baloo_Bhai_2 } from 'next/font/google';
import TimeSpentIndicator from '@/components/TimeSpentIndicator';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { format, getDate } from 'date-fns';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/20/solid';
import { setTargetDate } from '@/redux/slices/dateSlice';
import { format24To12, formattedTime12 } from '@/utils/dateService';
import DeleteModal from '@/components/DeleteModal';
import EditModal from '@/components/EditModal';

const inter = Baloo_Bhai_2({ subsets: ['latin'] });

export default function Attendance() {
  const attendance = useSelector((state) => state.attendance);
  const { year, month } = useSelector((state) => state.dateSlice);
  const dispatch = useDispatch();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  if (attendance[year] === undefined || attendance[year][month] === undefined) {
    return (
      <main className="bg-slate-300 text-slate-800 min-h-screen pb-16">
        <TimeSpentIndicator year={year} month={month} />
        <h2 className="text-xl text-center mt-5">No Data Found!</h2>
      </main>
    );
  }

  return (
    <main
      className={`bg-slate-300 dark:bg-slate-900 text-slate-800 min-h-screen pb-16 ${inter.className}`}
    >
      <TimeSpentIndicator />

      {Object.keys(attendance[year][month])
        .sort((a, b) => parseInt(b) - parseInt(a))
        .map((date) => {
          const obj = attendance[year][month][date];
          let loginTime = obj.login;
          let logoutTime = obj.logout;
          loginTime = loginTime ? formattedTime12(loginTime) : '00:00';
          if (!obj.logout.includes(':')) {
            logoutTime = '00:00';
          }
          logoutTime = logoutTime ? format24To12(logoutTime) : '00:00';
          if (!obj.hours.includes('-')) {
            obj.hours.split(':').map((v, i) => {
              v = parseInt(v);
              if (i == 0) {
                // hr = hr + v;
              } else {
                // min = min + v;
              }
            });
          }
          if (obj.present === '-') return;
          // TODO: total days

          return (
            <section
              key={date}
              className="h-36 md:h-44 w-full md:max-w-xl lg:max-w-2xl p-2 flex m-auto"
            >
              <div className="bg-cyan-800 w-[30%] flex flex-col items-center justify-center rounded-l-lg">
                <div className="bg-slate-50 w-[70%] rounded-tr-lg rounded-tl-lg h-6 mb-0.5 text-sm font-bold grid place-items-center">
                  {format(parseInt(date), 'EEEE')}
                </div>
                <div
                  className={`bg-slate-100 w-[70%] rounded-br-lg rounded-bl-lg h-16 grid place-items-center font-bold text-4xl `}
                >
                  {getDate(parseInt(date)).toString().padStart(2, '0')}
                </div>
              </div>

              <div className="bg-slate-800 w-[70%] rounded-r-lg grid items-center justify-center font-bold text-white flex-col relative p-2">
                <div className="flex justify-center text-sm md:text-base md:pb-2">
                  <p>
                    <span className="font-semibold">
                      {format(parseInt(date), 'dd-MMM-yyyy')}
                    </span>
                  </p>
                  {/* Edit-Btn */}
                  <button
                    className="text-blue-500 absolute right-3 hover:text-blue-400"
                    onClick={() => {
                      setIsEditOpen(!isEditOpen);
                      dispatch(setTargetDate(date));
                    }}
                  >
                    <PencilSquareIcon className="w-5" />
                  </button>
                  {/* Delete-Btn */}
                  <button
                    className="text-red-500 absolute left-3 hover:text-red-400"
                    onClick={() => {
                      setIsDeleteOpen(!isDeleteOpen);
                      dispatch(setTargetDate(date));
                    }}
                  >
                    <TrashIcon className="w-5" />
                  </button>
                </div>
                <div className="flex text-center gap-1">
                  <div>
                    <div
                      className={`bg-slate-600 flex place-items-center w-[5rem] md:w-28 max-w-full text-center rounded-md shadow-md text-xl font-bold py-3 px-2 `}
                    >
                      {loginTime?.toLowerCase().includes('am')
                        ? loginTime.slice(0, loginTime.length - 3)
                        : loginTime?.toLowerCase().includes('pm')
                        ? loginTime.slice(0, loginTime.length - 3)
                        : loginTime}
                      {loginTime?.toLowerCase().includes('am') ? (
                        <span className="ml-0.5 -mb-1.5 text-xs font-light">
                          AM
                        </span>
                      ) : (
                        <span className="ml-0.5 -mb-1.5 text-xs font-light">
                          PM
                        </span>
                      )}
                    </div>
                    <div className="w-[5rem] md:w-28 max-w-full rounded-md shadow-md font-semibold">
                      Login
                    </div>
                  </div>
                  <div>
                    <div
                      className={`bg-slate-600 flex justify-center items-center w-[5rem] md:w-28 max-w-full text-center rounded-md shadow-md text-xl font-bold py-3 px-2 `}
                    >
                      {logoutTime?.toLowerCase().includes('pm')
                        ? logoutTime.slice(0, logoutTime.length - 3)
                        : logoutTime.toLowerCase().includes('am')
                        ? loginTime.slice(0, loginTime.length - 3)
                        : loginTime}
                      {logoutTime?.toLowerCase().includes('pm') ? (
                        <span className="ml-0.5 -mb-1.5 text-xs font-light">
                          PM
                        </span>
                      ) : (
                        <span className="ml-0.5 -mb-1.5 text-xs font-light">
                          AM
                        </span>
                      )}
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
        })}
      {isDeleteOpen && (
        <DeleteModal isOpen={isDeleteOpen} setIsOpen={setIsDeleteOpen} />
      )}
      {isEditOpen && (
        <EditModal isOpen={isEditOpen} setIsOpen={setIsEditOpen} />
      )}
    </main>
  );
}
