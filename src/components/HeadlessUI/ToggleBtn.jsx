import { toggleOfficeMode } from "@/redux/slices/UserSettings";
import { Switch } from "@headlessui/react";
import { BriefcaseIcon, HomeIcon } from "@heroicons/react/20/solid";
import { useDispatch, useSelector } from "react-redux";

export default function ToogleBtn() {
  const { isOfficeMode } = useSelector((state) => state.userSettings);
  const dispatch = useDispatch();
  // Office Mode
  const handleOfficeMode = () => {
    dispatch(toggleOfficeMode());
    if (!isOfficeMode) {
      // let currentDate = new Date().setHours(0, 0, 0, 0);
      // let data = attendance[currentDate];
      // setLoginTime(data?.loginTime);
    }
  };
  return (
    <div className="flex items-center">
      <Switch
        checked={isOfficeMode}
        onChange={handleOfficeMode}
        className={`${isOfficeMode ? "bg-slate-800" : "bg-slate-600"}
          relative inline-flex h-[38px] w-[74px] shrink-0 cursor-pointer scale-[0.8] rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white/75 justify-between  items-center`}
      >
        {isOfficeMode && (
          <span
            className={`absolute text-[7px] w-5 capitalize text-white ml-1.5 ${
              isOfficeMode ? "grid place-items-center" : "hidden"
            }`}
          >
            <BriefcaseIcon />
            Office
          </span>
        )}
        <span className="sr-only">Use setting</span>

        <span
          aria-hidden="true"
          className={`${isOfficeMode ? "translate-x-9" : "translate-x-0"}
            pointer-events-none inline-block h-[34px] w-[34px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
        />

        {!isOfficeMode && (
          <span
            className={`text-[7px] w-5 capitalize text-white mr-1.5 ${
              !isOfficeMode ? "grid place-items-center" : "hidden"
            }`}
          >
            <HomeIcon />
            Home
          </span>
        )}
      </Switch>
    </div>
  );
}
