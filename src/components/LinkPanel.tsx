import Icon from "@mdi/react";
import { LinkGroup } from "../types/linkGroup";
import IconBtn from "./IconBtn";
import {
  mdiChevronDown,
  mdiChevronUp,
  mdiFormatListGroup,
  mdiPencil,
  mdiPlaylistEdit,
} from "@mdi/js";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { colorMap } from "../types/colors";
import Link from "./Link";
import { iconTranslation } from "../types/icons";

const handleIconClick = (e: React.MouseEvent, action: () => void) => {
  e.stopPropagation();
  action();
};

const LinkPanel = ({
  linkGroup,
  moveUp,
  moveDown,
}: {
  linkGroup: LinkGroup;
  moveUp: boolean;
  moveDown: boolean;
}) => {
  const [tabEdit, setTabEdit] = useState(false);
  const iconLookup = linkGroup.icon
    ? iconTranslation[linkGroup.icon]
    : mdiFormatListGroup;
  const colorLookup = linkGroup.color
    ? colorMap[linkGroup.color]
    : colorMap["unknown"];

  return (
    <div className="rounded-md flex flex-col border border-black m-5">
      {/* Header Section */}
      <div
        className={`flex flex-row w-full text-white rounded-t-md px-3 py-3 items-center font-bold ${colorLookup.background}`}
      >
        {linkGroup.icon && <Icon path={iconLookup} size={1} />}
        <span className="ml-3 text-xl">{linkGroup.name}</span>

        {/* Edit Buttons - Animated */}
        <AnimatePresence>
          {tabEdit && (
            <motion.div
              className="flex flex-row ml-3"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <IconBtn
                path={mdiPencil}
                tooltipText="Edit Group"
                color={colorLookup.icon}
                size={1}
                onClick={(e) =>
                  handleIconClick(e, () => console.log("edit group"))
                }
              />
              {moveUp && (
                <IconBtn
                  path={mdiChevronUp}
                  tooltipText="Move Up"
                  color={colorLookup.icon}
                  size={1}
                  onClick={(e) =>
                    handleIconClick(e, () => console.log("move up"))
                  }
                />
              )}
              {moveDown && (
                <IconBtn
                  path={mdiChevronDown}
                  tooltipText="Move Down"
                  color={colorLookup.icon}
                  size={1}
                  onClick={(e) =>
                    handleIconClick(e, () => console.log("move down"))
                  }
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit Toggle Button */}
        <div className="ml-auto">
          <IconBtn
            className={`focus:outline-2 focus:outline-offset-2 ${colorLookup.focus}`}
            path={mdiPlaylistEdit}
            tooltipText={tabEdit ? "Hide Controls" : "Show Controls"}
            color={colorLookup.icon}
            size={1}
            onClick={(e) => handleIconClick(e, () => setTabEdit(!tabEdit))}
          />
        </div>
      </div>

      {/* Link List */}
      <div className="pt-1 pb-3">
        {linkGroup.linkList.map((item, index) => (
          <Link
            key={`${linkGroup.name}-${index}`}
            item={item}
            upArrow={index !== 0}
            downArrow={index !== linkGroup.linkList.length - 1}
            editMode={tabEdit}
          />
        ))}
      </div>
    </div>
  );
};

export default LinkPanel;
