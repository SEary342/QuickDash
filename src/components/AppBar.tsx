import { useState, useRef } from "react";
import { mdiChevronDown, mdiCog, mdiMinus, mdiPlus } from "@mdi/js";
import IconBtn from "./IconBtn";
import { motion } from "motion/react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, setNumberOfColumns } from "../store/store";
const colMax = 6;
const colMin = 1;

// TODO: Implement Import, Export
const AppBar = () => {
  const dispatch = useDispatch();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const columns = useSelector((state: RootState) => state.app.numberOfColumns); // Default to 3 columns
  const appVersion = import.meta.env.APP_VERSION;

  const appBarRef = useRef<HTMLDivElement | null>(null);

  const handleColumnIncrease = () => {
    if (columns < colMax) dispatch(setNumberOfColumns(columns + 1));
  };

  const handleColumnDecrease = () => {
    if (columns > colMin) dispatch(setNumberOfColumns(columns - 1));
  };

  const handleImport = () => {
    // TODO: Implement Import functionality
    console.log("Import clicked");
  };

  const handleExport = () => {
    // TODO: Implement Export functionality
    console.log("Export clicked");
  };

  return (
    <div
      ref={appBarRef}
      className="relative flex flex-row items-center bg-slate-800 p-2 shadow-xl"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        width="40"
        height="40"
        viewBox="0 0 200 200"
      >
        <rect width="200" height="200" fill="#7f00ff" />
        <ellipse
          cx="65"
          cy="100"
          rx="45"
          ry="50"
          fill="none"
          stroke="#ffffff"
          strokeWidth="15"
        />
        <line
          x1="65"
          y1="100"
          x2="100"
          y2="140"
          stroke="#ffffff"
          strokeWidth="15"
          strokeLinecap="round"
        />
        <path
          d="M130,50 L130,150 Q160,150 170,125 Q180,100 170,75 Q160,50 130,50 Z"
          fill="none"
          stroke="#ffffff"
          strokeWidth="15"
        />
      </svg>
      <span className="ml-3 text-2xl font-bold text-white">QuickDash</span>
      <IconBtn
        path={mdiCog}
        auxPath={mdiChevronDown}
        tooltipText="Settings"
        color="white"
        className="ml-auto hover:bg-slate-600"
        tooltipPosition="left"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      />
      {isDropdownOpen && (
        <motion.div
          className="absolute right-0 w-48 bg-white text-black rounded-lg shadow-lg p-3 z-10"
          initial={{ opacity: 0, y: -20 }} // Initial state (dropdown is invisible and slightly above)
          animate={{ opacity: 1, y: 0 }} // Final state (dropdown becomes visible and moves into position)
          exit={{ opacity: 0, y: -20 }} // Exit state (dropdown fades and moves up when closed)
          transition={{ duration: 0.3 }} // Duration of the animation
          style={{
            top: appBarRef.current ? appBarRef.current.offsetHeight : 0, // Calculate the top position based on the app bar height
          }}
        >
          <div className="space-y-2">
            <button
              onClick={handleImport}
              className="w-full text-left p-2 hover:bg-gray-200 rounded"
            >
              Import
            </button>
            <button
              onClick={handleExport}
              className="w-full text-left p-2 hover:bg-gray-200 rounded"
            >
              Export
            </button>
            <hr />
            <div className="px-2">
              <p>Columns</p>
              <div className="flex items-center space-x-2 w-full text-left py-1">
                <IconBtn
                  path={mdiMinus}
                  size={1}
                  onClick={handleColumnDecrease}
                  tooltipText="Decrease Columns"
                  color="black"
                  className="bg-gray-200 rounded hover:bg-gray-300"
                  disabled={columns <= colMin}
                />
                <span className="text-lg font-semibold">{columns}</span>
                <IconBtn
                  path={mdiPlus}
                  size={1}
                  onClick={handleColumnIncrease}
                  tooltipText="Increase Columns"
                  color="black"
                  className="bg-gray-200 rounded hover:bg-gray-300"
                  disabled={columns >= colMax}
                />
              </div>
            </div>
            <hr />
            <div className="w-full text-left p-2">
              <span className="block text-sm font-semibold">App Version</span>
              <p className="text-sm">{appVersion}</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AppBar;
