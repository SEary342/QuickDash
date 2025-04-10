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
import {
  deleteLinkGroup,
  reorderLinkGroups,
  updateLinkGroup,
} from "../store/store";
import PanelDialog from "./DashGroupDialog";
import { LinkPage } from "../types/linkPage";
import { LinkAdd } from "./LinkAdd";

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
  const [editDialog, setEditDialog] = useState(false);

  return (
    <div className="rounded-md flex flex-col border border-black m-3">
      <div
        className={`flex flex-row w-full ${colorLookup.text} rounded-t-md p-3 items-center font-bold ${colorLookup.background}`}
      >
        {linkGroup.icon && <Icon path={iconLookup} size={1} />}
        <span className="ml-3 text-xl">{linkGroup.name}</span>
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
                className={`${colorLookup.hoverColor}`}
                tooltipText="Edit Group"
                color={colorLookup.text}
                size={1}
                onClick={() => setEditDialog(true)}
              />
              <PanelDialog
                isOpen={editDialog}
                onClose={(
                  _?: LinkPage,
                  linkGroup?: LinkGroup,
                  remove?: boolean
                ) => {
                  if (remove) {
                    dispatch(
                      deleteLinkGroup({
                        pageIndex: pageId,
                        groupIndex: panelId,
                      })
                    );
                  } else if (linkGroup) {
                    dispatch(
                      updateLinkGroup({
                        pageIndex: pageId,
                        groupIndex: panelId,
                        group: linkGroup,
                      })
                    );
                  }
                  setEditDialog(false);
                }}
                editMode={true}
                groupMode={true}
                pageId={pageId}
                linkGroup={linkGroup}
              />
              {moveUp && (
                <IconBtn
                  path={mdiChevronUp}
                  tooltipText="Move Up"
                  color={colorLookup.text}
                  className={`${colorLookup.hoverColor}`}
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
                  color={colorLookup.text}
                  className={`${colorLookup.hoverColor}`}
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
        <div className="ml-auto">
          <IconBtn
            className={`focus:outline-2 focus:outline-offset-2 ${colorLookup.focus} ${colorLookup.hoverColor}`}
            path={mdiPlaylistEdit}
            tooltipText={tabEdit ? "Hide Controls" : "Show Controls"}
            color={colorLookup.text}
            size={1}
            onClick={() => setTabEdit(!tabEdit)}
          />
        </div>
      </div>
      <AnimatePresence>
        <motion.div
          className="pt-1 pb-3 overflow-hidden"
          initial={{ opacity: 0, scale: 0.8, height: 0 }}
          animate={{ opacity: 1, scale: 1, height: "auto" }}
          exit={{ opacity: 0, scale: 0.8, height: 0 }}
          transition={{ duration: 0.1, ease: "easeIn" }}
          layout
        >
          {linkGroup.linkList.map((item, index) => (
            <Link
              key={`${linkGroup.name}-${index}`}
              pageId={pageId}
              panelId={panelId}
              id={index}
              item={item}
              upArrow={index !== 0}
              downArrow={index !== linkGroup.linkList.length - 1}
              editMode={tabEdit}
            />
          ))}
          {tabEdit && <LinkAdd pageId={pageId} panelId={panelId} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default LinkPanel;
