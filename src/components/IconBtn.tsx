import { useState } from "react";
import { Icon } from "@mdi/react";

const IconBtn = ({
  className,
  path,
  tooltipText,
  color,
  onClick,
  size
}: {
  className?: string;
  path: string;
  tooltipText: string;
  color: string;
  onClick?: (e: React.MouseEvent) => void;
  size?: number
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const iconSize = size != undefined ? size : 0.9

  return (
    <button
      className={`p-[2px] rounded-full cursor-pointer ${className}`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={onClick}
    >
      <Icon path={path} size={iconSize} color={color} />
      {showTooltip && (
        <div className="absolute bottom-full mb-2 px-2 py-1 bg-gray-800 text-white text-sm shadow-md text-nowrap rounded-md">
          {tooltipText}
        </div>
      )}
    </button>
  );
};

export default IconBtn;
