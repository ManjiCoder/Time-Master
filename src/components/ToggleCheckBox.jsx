import React, { useState } from "react";
import Modal from "./HeadlessUI/Modal";
import { useDispatch, useSelector } from "react-redux";
import { toggleIsShowAmt } from "@/redux/slices/UserSettings";

export default function ToggleCheckBox() {
  const {
    isShowAmt: isChecked,
    salaryAmount,
    minRate,
  } = useSelector((state) => state.userSettings);
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    dispatch(toggleIsShowAmt());
    
    if (!salaryAmount) {
        setIsOpen(!isOpen);
    }
  };
  return (
    <>
      <label htmlFor="showAmt" className="flex items-center space-x-1.5">
        <input
          type="checkbox"
          checked={isChecked}
          id="showAmt"
          className=""
          onClick={handleClick}
        />
        <span className="mt-1">{!isChecked ? "Show" : "hide"} Amount</span>
      </label>
      {isOpen && <Modal isOpen={isOpen} setIsOpen={setIsOpen} />}
    </>
  );
}
