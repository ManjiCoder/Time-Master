import Modal from "@/components/HeadlessUI/Modal";
import { formatAmt } from "@/components/TimeSpentIndicator";
import { toggleIsShowAmt } from "@/redux/slices/UserSettings";
import { PencilSquareIcon } from "@heroicons/react/20/solid";
import { Baloo_Bhai_2 } from "next/font/google";
import Link from "next/link";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const inter = Baloo_Bhai_2({ subsets: ["latin"] });

export default function Setting() {
  const { salaryAmount } = useSelector((state) => state.userSettings);
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);
  const handleClick = () => {
    dispatch(toggleIsShowAmt());
    setIsOpen(!isOpen);
  };

  return (
    <main
      className={`bg-slate-300 text-slate-800 min-h-screen pb-10 ${inter.className} py-4`}
    >
      <h2 className="text-2xl font-semibold px-4">Settings</h2>
      <ol className="flex flex-col mt-4 text-lg gap-y-4">
        <li className="bg-slate shadow-md rounded-md py-4 px-4 border border-slate-400">
          <Link href={"/"}>Home</Link>
        </li>
        <li className="bg-slate shadow-md rounded-md py-4 px-4 border border-slate-400">
          <Link href={"/upload"}>Upload File</Link>
        </li>
        <li className="bg-slate shadow-md rounded-md py-4 px-4 border border-slate-400">
          <Link href={"/text"}>Text-To-TimeLogs</Link>
        </li>
        <li className="bg-slate shadow-md rounded-md py-4 px-4 border border-slate-400 flex space-x-2 items-center justify-start">
          Salary Amount:{" "}
          <span className="font-semibold">
            {Number(salaryAmount).toLocaleString("en-IN", formatAmt)}
          </span>
          <button type="button" onClick={handleClick}>
            <PencilSquareIcon className="w-5 mb-1 text-blue-600" />
          </button>
        </li>
      </ol>

      {/* Set Amount Modal */}
      {isOpen && <Modal isOpen={isOpen} setIsOpen={setIsOpen} />}
    </main>
  );
}
