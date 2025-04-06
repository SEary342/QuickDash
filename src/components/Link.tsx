import { mdiChevronDown, mdiChevronUp, mdiLink, mdiPencil } from "@mdi/js";
import { getColorLookup } from "../types/colors";
import { iconTranslation } from "../types/icons";
import { LinkData } from "../types/linkData";
import Icon from "@mdi/react";
import IconBtn from "./IconBtn";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  deleteLinkData,
  reorderLinkData,
  updateLinkData,
} from "../store/store";
import LinkDialog from "./LinkDialog";

const Link = ({
  pageId,
  panelId,
  id,
  item,
  upArrow,
  downArrow,
  editMode,
}: {
  pageId: number;
  panelId: number;
  id: number;
  item: LinkData;
  upArrow?: boolean;
  downArrow?: boolean;
  editMode?: boolean;
}) => {
  const dispatch = useDispatch();
  const colorLookup = getColorLookup(item.color);
  const iconColor = item.outline ? colorLookup.outlineIcon : colorLookup.icon;
  const hoverColor = item.outline
    ? "hover:bg-gray-100"
    : colorLookup.hoverColor;
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.open(item.url, "_blank", "noopener noreferrer");
  };
  const [editDialog, setEditDialog] = useState(false);

  return (
    <div
      className={`relative flex items-center gap-3 m-3 hover:shadow-md rounded-xl ${
        item.outline
          ? `border-3 ${colorLookup.outlineBorder}`
          : colorLookup.background
      }`}
    >
      <a
        href={item.url}
        className={`${hoverColor} flex cursor-pointer w-full pl-3 py-3 rounded-s-xl ${
          editMode ? "" : "rounded-e-xl"
        }`}
        onClick={handleClick}
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
      </a>

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
                onClick={() =>
                  dispatch(
                    reorderLinkData({
                      pageIndex: pageId,
                      groupIndex: panelId,
                      fromIndex: id,
                      toIndex: id - 1,
                    })
                  )
                }
              />
            )}
            {downArrow && (
              <IconBtn
                className={hoverColor}
                path={mdiChevronDown}
                tooltipText="Move Down"
                color={iconColor}
                onClick={() =>
                  dispatch(
                    reorderLinkData({
                      pageIndex: pageId,
                      groupIndex: panelId,
                      fromIndex: id,
                      toIndex: id + 1,
                    })
                  )
                }
              />
            )}
            <IconBtn
              className={hoverColor}
              path={mdiPencil}
              tooltipText="Edit Link"
              color={iconColor}
              onClick={() => setEditDialog(true)}
            />
            <LinkDialog
              pageId={pageId}
              panelId={panelId}
              editMode={true}
              isOpen={editDialog}
              link={item}
              onClose={(linkData, remove) => {
                if (remove) {
                  dispatch(
                    deleteLinkData({
                      pageIndex: pageId,
                      groupIndex: panelId,
                      linkIndex: id,
                    })
                  );
                } else if (linkData) {
                  dispatch(
                    updateLinkData({
                      pageIndex: pageId,
                      groupIndex: panelId,
                      linkIndex: id,
                      link: linkData,
                    })
                  );
                }
                setEditDialog(false);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Link;
