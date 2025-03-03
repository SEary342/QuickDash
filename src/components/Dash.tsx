import Icon from "@mdi/react";
import { LinkPage } from "../types/linkPage";
import { iconTranslation } from "../types/icons";
import { getColorLookup } from "../types/colors";
import IconBtn from "./IconBtn";
import {
  mdiChevronLeft,
  mdiChevronRight,
  mdiPencil,
  mdiPlaylistEdit,
} from "@mdi/js";
import { useState } from "react";
import LinkPanel from "./LinkPanel";
import { LinkGroup } from "../types/linkGroup";
import { motion, AnimatePresence } from "motion/react";
import { LinkData } from "../types/linkData";
import { useDispatch, useSelector } from "react-redux";
import { reorderLinkPages, RootState, setSelectedDash } from "../store/store";
import { Dialog } from "./Dialog";

const TabBtn = ({
  id,
  linkPage,
  chevronLeft,
  chevronRight,
  tabSelectFunc,
  selected = false,
}: {
  id: number;
  linkPage: LinkPage;
  chevronLeft: boolean;
  chevronRight: boolean;
  tabSelectFunc: (id: number) => void;
  selected?: boolean;
}) => {
  const dispatch = useDispatch();
  const [tabEdit, setTabEdit] = useState(false);
  const colorLookup = getColorLookup(linkPage.color);
  const [editDialog, setEditDialog] = useState(false);

  return (
    <motion.li
      className={`me-2 flex flex-row rounded-t-xl ${
        colorLookup.background
      } overflow-hidden mt-1 ${
        selected ? `border-3 ${colorLookup.border}` : ""
      }`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {/* Tab Button */}
      <button
        className={`inline-flex items-center justify-center p-3 border-b-2 text-lg font-bold border-transparent rounded-t-lg group cursor-pointer ${colorLookup.text} ${colorLookup.hoverColor}`}
        onClick={() => tabSelectFunc(id)}
      >
        {linkPage.icon && (
          <Icon
            path={iconTranslation[linkPage.icon]}
            size={1}
            color={colorLookup.icon}
            className="mr-2"
          />
        )}
        {linkPage.name}
      </button>

      {/* Edit & Control Buttons Container */}
      <motion.div
        className={`relative flex items-center ${colorLookup.border} border-2 rounded-full my-2 transition-all duration-200 px-2 mr-3 ${colorLookup.text}`}
        initial={{ width: "auto", opacity: 1 }}
        animate={
          tabEdit
            ? { width: "auto", opacity: 1 }
            : { width: "auto", opacity: 1 }
        }
        transition={{ duration: 0.2, ease: "easeOut" }}
        style={{ overflow: "hidden", whiteSpace: "nowrap" }}
      >
        <AnimatePresence>
          {tabEdit && (
            <motion.div
              className="flex flex-row gap-2 items-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <IconBtn
                className={`${colorLookup.hoverColor}`}
                path={mdiPencil}
                color={colorLookup.icon}
                tooltipText="Edit Dash"
                tooltipPosition="bottom"
                onClick={() => setEditDialog(true)}
              />
              <Dialog
                title="Edit Group"
                isOpen={editDialog}
                onClose={() => setEditDialog(false)}
              >
                test
              </Dialog>
              {chevronLeft && (
                <IconBtn
                  className={`${colorLookup.hoverColor}`}
                  path={mdiChevronLeft}
                  color={colorLookup.icon}
                  tooltipText="Move Dash Left"
                  tooltipPosition="bottom"
                  onClick={() =>
                    dispatch(
                      reorderLinkPages({ fromIndex: id, toIndex: id - 1 })
                    )
                  }
                />
              )}
              {chevronRight && (
                <IconBtn
                  className={`${colorLookup.hoverColor}`}
                  path={mdiChevronRight}
                  color={colorLookup.icon}
                  tooltipText="Move Dash Right"
                  tooltipPosition="bottom"
                  onClick={() =>
                    dispatch(
                      reorderLinkPages({ fromIndex: id, toIndex: id + 1 })
                    )
                  }
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
        <IconBtn
          className={`${colorLookup.hoverColor}`}
          path={mdiPlaylistEdit}
          color={colorLookup.icon}
          tooltipText={tabEdit ? "Hide Controls" : "Show Controls"}
          tooltipPosition="bottom"
          onClick={() => setTabEdit(!tabEdit)}
        />
      </motion.div>
    </motion.li>
  );
};

function distributeLinkGroups(
  groups: LinkGroup[],
  numColumns: number
): LinkGroup[][] {
  // Flatten all LinkData into an array with references to their parent groups
  const allLinks: { group: LinkGroup; data: LinkData }[] = [];
  for (const group of groups) {
    for (const link of group.linkList) {
      allLinks.push({ group, data: link });
    }
  }

  // Calculate how many items per column
  const result: LinkGroup[][] = Array.from({ length: numColumns }, () => []);

  // Track group placements to maintain structure
  const groupMap = new Map<LinkGroup, LinkGroup>();
  let columnIndex = 0;

  // Ensure all groups are placed, even if empty
  for (const group of groups) {
    if (!groupMap.has(group)) {
      const newGroup: LinkGroup = { ...group, linkList: [] };
      groupMap.set(group, newGroup);
      result[columnIndex].push(newGroup);
      columnIndex = (columnIndex + 1) % numColumns;
    }
  }

  columnIndex = 0;
  for (const { group, data } of allLinks) {
    // Add the link data to the correct group in the result set
    groupMap.get(group)!.linkList.push(data);

    // Move to the next column
    columnIndex = (columnIndex + 1) % numColumns;
  }

  return result;
}

const Dash = ({ linkPages }: { linkPages: LinkPage[]; columns?: number }) => {
  const dispatch = useDispatch();
  const selectedDash = useSelector(
    (state: RootState) => state.app.selectedDash
  );
  const pageIndex = linkPages.findIndex((page) => page.name === selectedDash);
  const resolvedPageIndex = pageIndex !== -1 ? pageIndex : 0;

  const columns = useSelector((state: RootState) => state.app.numberOfColumns);
  const renderedPage = linkPages[resolvedPageIndex];

  const groupList = renderedPage ? renderedPage.groupList : [];
  const columnGroups = distributeLinkGroups(groupList, columns);

  const flattenedGroups = columnGroups.flat();
  const totalGroups = flattenedGroups.length;

  const handlePageIndexChange = (newIndex: number) => {
    if (linkPages[newIndex]) {
      dispatch(setSelectedDash(linkPages[newIndex].name));
    }
  };

  return (
    <>
      <div className="border-b border-gray-200 dark:border-gray-700">
        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
          {linkPages.map((pg, idx) => (
            <TabBtn
              key={`${pg.name}-${idx}`}
              id={idx}
              linkPage={pg}
              chevronLeft={idx !== 0}
              chevronRight={idx < linkPages.length - 1}
              tabSelectFunc={handlePageIndexChange}
              selected={resolvedPageIndex === idx}
            />
          ))}
        </ul>
      </div>

      {/* Animating the grid transition */}
      <AnimatePresence mode="wait">
        <motion.div
          key={pageIndex} // This triggers animation when the tab changes
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="grid gap-4"
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {columnGroups.map((groupColumn, colIdx) => (
            <div key={`column-${colIdx}`} className="flex flex-col gap-4">
              {groupColumn.map((gp, idx) => {
                const globalIndex = flattenedGroups.indexOf(gp);

                return (
                  <LinkPanel
                    pageId={pageIndex}
                    panelId={globalIndex}
                    key={`${gp.name}-${idx}`}
                    linkGroup={gp}
                    moveUp={globalIndex > 0}
                    moveDown={globalIndex < totalGroups - 1}
                  />
                );
              })}
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default Dash;
