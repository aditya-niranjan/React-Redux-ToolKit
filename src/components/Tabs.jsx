import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setActiveTab } from "../redux/Features/searchSlice";

const Tabs = () => {
  const tabs = ["Photos", "Videos"];

  const dispatch = useDispatch();

  const activeTab = useSelector((state) => state.search.activeTab);

  return (
    <div className="w-full flex justify-center mt-3  border-b gap-5 border-gray-300">
      {tabs.map((elem, idx) => {
        return (
          <button
            key={idx}
            className={`${(activeTab == elem ?"bg-blue-700" : "bg-gray-600")} mb-3 btn-donate cursor-pointer  transition-all duration-300"`}
            onClick={() => {
              dispatch(setActiveTab(elem));
            }}
          >
            {elem}
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;
