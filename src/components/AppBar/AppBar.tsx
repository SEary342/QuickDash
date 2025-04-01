import { useState, useRef, useEffect } from "react";
import {
  mdiChevronDown,
  mdiCog,
  mdiExport,
  mdiImport,
  mdiMinus,
  mdiPlus,
} from "@mdi/js";
import IconBtn from "../IconBtn";
import { motion } from "motion/react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, setNumberOfColumns } from "../../store/store";
import Icon from "@mdi/react";
import FileImportDialog from "../FileImportDialog";
import { LinkPage } from "../../types/linkPage";

const colMax = 6;
const colMin = 1;

declare global {
  interface Navigator {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    msSaveBlob?: (blob: any, defaultName?: string) => boolean;
  }
}

function exportConfig(
  exportFileName: string,
  fileExtension: string,
  exportData: LinkPage[]
) {
  const jsonFile = JSON.stringify(exportData);
  const blob = new Blob([jsonFile], { type: "application/json" });
  if (navigator.msSaveBlob) {
    // IE 10+
    navigator.msSaveBlob(blob, exportFileName);
  } else {
    const link = document.createElement("a");
    if (link.download !== undefined) {
      // feature detection
      // Browsers that support HTML5 download attribute
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", exportFileName.concat(fileExtension));
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}

const AppBar = ({ linkPages }: { linkPages: LinkPage[] }) => {
  const dispatch = useDispatch();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const columns = useSelector((state: RootState) => state.app.numberOfColumns);
  const appVersion = import.meta.env.APP_VERSION;

  const appBarRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleColumnIncrease = () => {
    if (columns < colMax) dispatch(setNumberOfColumns(columns + 1));
  };

  const handleColumnDecrease = () => {
    if (columns > colMin) dispatch(setNumberOfColumns(columns - 1));
  };

  const handleExport = () => {
    exportConfig("QuickDashConfig", ".QDconfig", linkPages);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        appBarRef.current &&
        !appBarRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
          ref={dropdownRef} // Reference to the dropdown
          className="absolute right-0 w-48 bg-white text-black rounded-lg shadow-lg p-3 z-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          style={{
            top: appBarRef.current ? appBarRef.current.offsetHeight : 0,
          }}
        >
          <div className="space-y-2">
            <button
              onClick={() => setImportOpen(true)}
              className="w-full text-left p-2 hover:bg-gray-200 rounded flex flex-row cursor-pointer"
            >
              <Icon path={mdiImport} size={1} className="mr-2" />
              Import
            </button>
            <FileImportDialog
              isOpen={importOpen}
              onClose={() => {
                setImportOpen(false);
              }}
            />
            <button
              onClick={handleExport}
              className="w-full text-left p-2 hover:bg-gray-200 rounded  flex flex-row cursor-pointer"
            >
              <Icon path={mdiExport} size={1} className="mr-2" /> Export
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
