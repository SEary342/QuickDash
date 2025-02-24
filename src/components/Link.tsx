import { mdiLink } from "@mdi/js";
import { colorMap } from "../types/colors";
import { iconTranslation } from "../types/icons";
import { LinkData } from "../types/linkData";
import Icon from "@mdi/react";

type LinkProps = { item: LinkData };

const Link = ({ item }: LinkProps) => {
  const colorLookup = colorMap[item.color];
  return (
    <div
      className={`${
        item.outline ? `border-3 ${colorLookup.border}` : colorLookup.background
      } py-5 rounded-xl flex flex-row px-3 m-3`}
    >
      <Icon
        path={item.icon ? iconTranslation[item.icon] : mdiLink}
        size={1}
        color="white"
      />
      <span
        className={`${
          item.outline ? colorLookup.text : "text-white"
        } font-bold ms-3`}
      >
        {item.text}
      </span>
    </div>
  );
};

export default Link;
