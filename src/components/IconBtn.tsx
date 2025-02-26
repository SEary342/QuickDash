import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@mdi/react";

const IconBtn = ({
  className,
  path,
  auxPath,
  tooltipText,
  color,
  onClick,
  size,
  tooltipPosition = "top",
}: {
  className?: string;
  path: string;
  auxPath?: string;
  tooltipText: string;
  color: string;
  onClick?: (e: React.MouseEvent) => void;
  size?: number;
  tooltipPosition?: "top" | "bottom" | "left" | "right";
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipStyle, setTooltipStyle] = useState({});
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const iconSize = size !== undefined ? size : 0.9;

  useEffect(() => {
    if (!showTooltip || !buttonRef.current) return;

    const buttonRect = buttonRef.current.getBoundingClientRect();
    const tooltipPadding = 8; // Space between button and tooltip

    let top = buttonRect.top - tooltipPadding;
    let left = buttonRect.left + buttonRect.width / 2;
    let transform = "translateX(-50%)";

    if (tooltipPosition === "bottom") {
      top = buttonRect.bottom + tooltipPadding;
    } else if (tooltipPosition === "left") {
      left = buttonRect.left - tooltipPadding;
      transform = "translateX(-100%)";
    } else if (tooltipPosition === "right") {
      left = buttonRect.right + tooltipPadding;
      transform = "translateX(0%)";
    }

    // Ensure tooltip is fully visible within viewport
    if (top < 0) top = buttonRect.bottom + tooltipPadding;
    if (top + 40 > window.innerHeight) top = buttonRect.top - 40;
    if (left < 0) left = 8;
    if (left + 100 > window.innerWidth) left = window.innerWidth - 108;

    setTooltipStyle({ top, left, transform });
  }, [showTooltip, tooltipPosition]);

  return (
    <>
      <button
        ref={buttonRef}
        className={`relative p-[2px] rounded-full cursor-pointer flex flex-row ${className}`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={onClick}
      >
        <Icon path={path} size={iconSize} color={color} />
        {auxPath && <Icon path={auxPath} size={iconSize} color={color} />}
      </button>

      {showTooltip &&
        createPortal(
          <div
            className="fixed px-2 py-1 bg-gray-800 text-white text-sm shadow-md text-nowrap rounded-md z-50"
            style={tooltipStyle}
          >
            {tooltipText}
          </div>,
          document.body
        )}
    </>
  );
};

export default IconBtn;
