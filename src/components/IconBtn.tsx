import { useState } from "react";
import { Icon } from "@mdi/react";

const IconBtn = ({
  className,
  path,
  tooltipText,
  color,
  onClick, // New prop for custom button action
}: {
  className: string;
  path: string;
  tooltipText: string;
  color: string;
  onClick?: (e: React.MouseEvent) => void;
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <button
      className={`p-[2px] rounded-full cursor-pointer ${className}`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={onClick}
    >
      <Icon path={path} size={0.9} color={color} />
      {showTooltip && (
        <div className="absolute bottom-full mb-2 px-2 py-1 bg-gray-800 text-white text-sm shadow-md text-nowrap rounded-md">
          {tooltipText}
        </div>
      )}
    </button>
  );
};

export default IconBtn;
