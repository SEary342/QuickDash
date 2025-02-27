import { mdiChevronDown, mdiChevronUp, mdiLink, mdiPencil } from "@mdi/js";
import { colorMap } from "../types/colors";
import { iconTranslation } from "../types/icons";
import { LinkData } from "../types/linkData";
import Icon from "@mdi/react";
import IconBtn from "./IconBtn";
import { motion, AnimatePresence } from "framer-motion";

const Link = ({
  item,
  upArrow,
  downArrow,
  editMode,
}: {
  item: LinkData;
  upArrow?: boolean;
  downArrow?: boolean;
  editMode?: boolean;
}) => {
  const colorLookup = colorMap[item.color];
  const iconColor = item.outline ? colorLookup.outlineIcon : colorLookup.icon;
  const hoverColor = item.outline
    ? "hover:bg-gray-100"
    : colorLookup.hoverColor;
  const handleClick = () => {
    window.open(item.url, "_blank", "noopener noreferrer");
  };

  const handleIconClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  };

  return (
    <div
      className={`relative flex items-center gap-3 m-3 hover:shadow-md rounded-xl ${
        item.outline
          ? `border-3 ${colorLookup.outlineBorder}`
          : colorLookup.background
      }`}
    >
      <div
        className={`${hoverColor} flex cursor-pointer w-full pl-3 py-3 rounded-s-xl ${
          editMode ? "" : "rounded-e-xl"
        }`}
        onClick={() => {
          handleClick();
        }}
      >
        <Icon
          path={item.icon ? iconTranslation[item.icon] : mdiLink}
          size={1}
          color={iconColor}
        />
        <span
          className={`${
            item.outline ? colorLookup.outlineText : colorLookup.text
          } font-bold ms-3`}
        >
          {item.text}
        </span>
      </div>

      {/* Conditionally Rendered Edit Buttons with Framer Motion */}
      <AnimatePresence>
        {editMode && (
          <motion.div
            className="flex flex-row ml-auto pr-3"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {upArrow && (
              <IconBtn
                className={hoverColor}
                path={mdiChevronUp}
                tooltipText="Move Up"
                color={iconColor}
                onClick={(e) =>
                  handleIconClick(e, () => console.log("up clicked"))
                }
              />
            )}
            {downArrow && (
              <IconBtn
                className={hoverColor}
                path={mdiChevronDown}
                tooltipText="Move Down"
                color={iconColor}
                onClick={(e) =>
                  handleIconClick(e, () => console.log("down clicked"))
                }
              />
            )}
            <IconBtn
              className={hoverColor}
              path={mdiPencil}
              tooltipText="Edit Link"
              color={iconColor}
              onClick={(e) =>
                handleIconClick(e, () => console.log("edit clicked"))
              }
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Link;
