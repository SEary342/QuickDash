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
import { getColorLookup } from "../types/colors";
import Link from "./Link";
import { iconTranslation } from "../types/icons";
import { useDispatch } from "react-redux";
import { reorderLinkGroups } from "../store/store";

const LinkPanel = ({
  pageId,
  panelId,
  linkGroup,
  moveUp,
  moveDown,
}: {
  pageId: number;
  panelId: number;
  linkGroup: LinkGroup;
  moveUp: boolean;
  moveDown: boolean;
}) => {
  const dispatch = useDispatch();
  const [tabEdit, setTabEdit] = useState(false);
  const iconLookup = linkGroup.icon
    ? iconTranslation[linkGroup.icon]
    : mdiFormatListGroup;
  const colorLookup = getColorLookup(linkGroup.color);

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
                onClick={() => console.log("edit group")}
              />
              {moveUp && (
                <IconBtn
                  path={mdiChevronUp}
                  tooltipText="Move Up"
                  color={colorLookup.icon}
                  size={1}
                  onClick={() =>
                    dispatch(
                      reorderLinkGroups({
                        pageIndex: pageId,
                        fromIndex: panelId,
                        toIndex: panelId - 1,
                      })
                    )
                  }
                />
              )}
              {moveDown && (
                <IconBtn
                  path={mdiChevronDown}
                  tooltipText="Move Down"
                  color={colorLookup.icon}
                  size={1}
                  onClick={() =>
                    dispatch(
                      reorderLinkGroups({
                        pageIndex: pageId,
                        fromIndex: panelId,
                        toIndex: panelId + 1,
                      })
                    )
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
            onClick={() => setTabEdit(!tabEdit)}
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
