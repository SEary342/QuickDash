import { useState } from "react";
import { Icon } from "@mdi/react";

const IconBtn = ({
  path,
  tooltipText,
  color,
  hoverColor,
  onClick, // New prop for custom button action
}: {
  path: string;
  tooltipText: string;
  color: string;
  hoverColor?: string;
  onClick?: () => void; // Optional click handler
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <button
      className={`relative flex items-center cursor-pointer ${hoverColor ? `hover:${hoverColor}` : ""}`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={(e) => {
        e.stopPropagation(); // Prevents parent div click
        if (onClick) onClick(); // Calls the provided click handler
      }}
    >
      <Icon path={path} size={1} color={color} />
      {showTooltip && (
        <div className="absolute bottom-full mb-2 px-2 py-1 bg-gray-800 text-white text-sm shadow-md text-nowrap rounded-md">
          {tooltipText}
        </div>
      )}
    </button>
  );
};

export default IconBtn;
