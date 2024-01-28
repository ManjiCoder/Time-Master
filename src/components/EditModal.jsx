import { editByDate } from '@/redux/slices/attendanceSlice';
import { calculateTimeSpent, removeAMorPM } from '@/utils/dateService';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/20/solid';
import { format } from 'date-fns';
import { Fragment, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function EditModal({ isOpen, setIsOpen }) {
  const attendance = useSelector((state) => state.attendance);
  const { year, month, targetDate } = useSelector((state) => state.dateSlice);
  const dispatch = useDispatch();
  const data = attendance[year][month][targetDate];
  const { login, logout, hours } = data;
  const [loginTime, setLoginTime] = useState(removeAMorPM(login));
  const [logoutTime, setLogoutTime] = useState(removeAMorPM(logout));
  const [hoursTime, setHoursTime] = useState(hours);
  // const [isCalculateTime, setIsCalculateTime] = useState(true);

  function closeModal() {
    setIsOpen(false);
  }

  const calculateTimeSpentInHrsMins = (login, logout) => {
    const diffObj = calculateTimeSpent(login, logout);
    const { hrs, mins } = diffObj;
    return `${hrs.toString().padStart(2, '0')}:${mins
      .toString()
      .padStart(2, '0')}`;
  };

  const handleEdit = (e) => {
    e.preventDefault();

    const targetDateData = attendance[year][month][targetDate];

    const editedData = {
      ...targetDateData,
      login: loginTime,
      logout: logoutTime,
      hours: hoursTime,
    };
    const payload = {
      year,
      month,
      date: targetDate,
      data: editedData,
    };
    // console.table(payload.data);
    dispatch(editByDate(payload));
    closeModal();
  };

  return (
    <>
      <Transition appear show={true} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/70" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-2xl font-medium text-center mb-3 leading-6 text-gray-900"
                  >
                    Are you sure?
                  </Dialog.Title>
                  <button onClick={closeModal}>
                    <XMarkIcon className="absolute top-5 right-4 w-7 text-gray-900 text-xl" />
                  </button>
                  <h2 className="text-center font-medium mb-4 text-gray-900">
                    Do you want to edit the{' '}
                    {format(
                      attendance[year][month][targetDate].date,
                      'dd-MMM-yyyy'
                    )}{' '}
                    TimeLog?
                  </h2>

                  <form
                    className="grid grid-cols-2 text-gray-900 my-5 gap-4 justify-evenly items-center"
                    onSubmit={handleEdit}
                  >
                    <div className="time inline-flex flex-col justify-center items-center gap-2 p-4 rounded-md shadow-md bg-slate-200">
                      <input
                        className="outline-none focus-within:ring-2 rounded-md shadow-md px-1 py-2"
                        type="time"
                        name="login"
                        id="login"
                        // step={300}
                        // pattern="(?:1[012]|0[0-9]):[0-5][0-9] (?:AM|PM)"
                        onChange={(e) => {
                          setLoginTime(e.target.value);
                          setHoursTime(
                            calculateTimeSpentInHrsMins(
                              e.target.value,
                              logoutTime
                            )
                          );
                        }}
                        placeholder="hh:mm AM/PM"
                        value={loginTime}
                      />
                      <h4 className="text-lg font-medium">Log-In</h4>
                    </div>
                    <div className="time inline-flex flex-col justify-center items-center gap-2 p-4 rounded-md shadow-md bg-slate-200">
                      <input
                        className="outline-none focus-within:ring-2 rounded-md shadow-md px-1 py-2"
                        type="time"
                        name="logout"
                        id="logout"
                        onChange={(e) => {
                          setLogoutTime(e.target.value);
                          setHoursTime(
                            calculateTimeSpentInHrsMins(
                              loginTime,
                              e.target.value
                            )
                          );
                        }}
                        placeholder="hh:mm AM/PM"
                        value={logoutTime}
                      />

                      <h4 className="text-lg font-medium">Log-Out</h4>
                    </div>

                    {/* <div class="flex items-center">
                      <input
                        checked={isCalculateTime}
                        id="checked-checkbox"
                        onChange={(e) => setIsCalculateTime(!isCalculateTime)}
                        type="checkbox"
                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label
                        for="checked-checkbox"
                        class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        Calculate Time Difference
                      </label>
                    </div> */}
                    <div className="time w-44 mx-auto col-span-2 flex flex-col justify-center items-center gap-2 p-4 rounded-md shadow-md bg-slate-200">
                      <input
                        className="outline-none focus-within:ring-2 rounded-md shadow-md px-1 py-2 w-20 text-center"
                        type="text"
                        onChange={(e) => setHoursTime(e.target.value)}
                        placeholder="hh:mm"
                        maxLength={5}
                        value={hoursTime}
                      />

                      <h4 className="text-lg font-medium">Time-Spent</h4>
                    </div>
                    <button
                      type="submit"
                      className="col-span-2 mx-auto bg-slate-700 px-4 py-2 rounded-md shadow-md text-white"
                    >
                      Submit
                    </button>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
