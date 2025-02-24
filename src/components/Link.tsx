import { mdiChevronDown, mdiChevronUp, mdiLink, mdiPencil } from "@mdi/js";
import { colorMap } from "../types/colors";
import { iconTranslation } from "../types/icons";
import { LinkData } from "../types/linkData";
import Icon from "@mdi/react";
import IconBtn from "./IconBtn";

type LinkProps = {
  item: LinkData;
  upArrow?: boolean;
  downArrow?: boolean;
  editMode?: boolean;
};

const Link = ({ item, upArrow, downArrow, editMode }: LinkProps) => {
  const colorLookup = colorMap[item.color];
  const iconColor = item.outline ? colorLookup.icon : "white";
  const hoverColor = item.outline
    ? "bg-gray-100"
    : colorLookup.hoverColor;
  const handleClick = () => {
    window.open(item.url, "_blank", "noopener noreferrer");
  };
  return (
    <div
      className={`${
        item.outline ? `border-3 ${colorLookup.border}` : colorLookup.background
      }
      hover:${hoverColor}
      hover:shadow-md py-5 rounded-xl flex flex-row px-3 m-3 cursor-pointer`}
      onClick={handleClick}
    >
      <Icon
        path={item.icon ? iconTranslation[item.icon] : mdiLink}
        size={1}
        color={iconColor}
      />
      <span
        className={`${
          item.outline ? colorLookup.text : "text-white"
        } font-bold ms-3`}
      >
        {item.text}
      </span>
      {editMode && (
        <span className="flex flex-row ml-auto">
          {upArrow && (
            <IconBtn
              path={mdiChevronUp}
              tooltipText="Move Up"
              color={iconColor}
              hoverColor={hoverColor}
            />
          )}
          {downArrow && (
            <IconBtn
              path={mdiChevronDown}
              tooltipText="Move Down"
              color={iconColor}
              hoverColor={hoverColor}
            />
          )}
          <IconBtn
            path={mdiPencil}
            tooltipText="Edit Link"
            color={iconColor}
            hoverColor={hoverColor}
          />
        </span>
      )}
    </div>
  );
};

export default Link;
