import { mdiChevronDown, mdiCog } from "@mdi/js";
import IconBtn from "./IconBtn";

// TODO implement drop down menu

const AppBar = () => {
  return (
    <div className="flex flex-row items-center bg-slate-800 p-2 shadow-xl">
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
      />
    </div>
  );
};

export default AppBar;
