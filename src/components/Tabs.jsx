import { useDispatch, useSelector } from "react-redux";
import { setActiveTab } from "../redux/Features/searchSlice";

const Tabs = () => {
  const tabs = ['photos','videos'];

  const dispatch = useDispatch();

  const activeTab = useSelector((state) => state.search.activeTab);

  return (
    <div className="w-full flex justify-center mt-3  border-b gap-5 border-gray-300">
      {tabs.map((elem, idx) => {
        return (
          <button
            key={idx}
            className={`${(activeTab == elem ?"bg-blue-700  scale-120"  : "bg-gray-600 scale-100")} mb-3 py-1 px-4 rounded-full active:scale-90 uppercase  cursor-pointer  transition-all duration-200"`}
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
