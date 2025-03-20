import { LinkPage } from "../types/linkPage";
import IconBtn from "./IconBtn";
import { mdiPlus } from "@mdi/js";
import { useState } from "react";
import LinkPanel from "./LinkPanel";
import { LinkGroup } from "../types/linkGroup";
import { motion, AnimatePresence } from "motion/react";
import { LinkData } from "../types/linkData";
import { useDispatch, useSelector } from "react-redux";
import { addLinkPage, RootState, setSelectedDash } from "../store/store";

import PanelDialog from "./DashGroupDialog";
import TabBtn from "./TabBtn";

function distributeLinkGroups(
  groups: LinkGroup[],
  numColumns: number
): LinkGroup[][] {
  const allLinks: { group: LinkGroup; data: LinkData }[] = [];
  for (const group of groups) {
    for (const link of group.linkList) {
      allLinks.push({ group, data: link });
    }
  }

  const result: LinkGroup[][] = Array.from({ length: numColumns }, () => []);

  const groupMap = new Map<LinkGroup, LinkGroup>();
  let columnIndex = 0;

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
    groupMap.get(group)!.linkList.push(data);
    columnIndex = (columnIndex + 1) % numColumns;
  }

  return result;
}

const Dash = ({ linkPages }: { linkPages: LinkPage[]; columns?: number }) => {
  const dispatch = useDispatch();
  const selectedDash = useSelector(
    (state: RootState) => state.app.selectedDash
  );
  const [addPage, setAddPage] = useState(false);
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
        <ul className="flex flex-wrap text-sm font-medium text-center ms-[2px]">
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
          <li className="flex items-center justify-center">
            <IconBtn
              path={mdiPlus}
              className="cursor-pointer hover:bg-gray-300 rounded-full"
              tooltipText="Add Dash"
              color="black"
              onClick={() => setAddPage(!addPage)}
              size={1.5}
            />
            <PanelDialog
              isOpen={addPage}
              onClose={(linkPage?: LinkPage) => {
                if (linkPage) {
                  dispatch(addLinkPage(linkPage));
                }
                setAddPage(false);
              }}
            />
          </li>
        </ul>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={pageIndex}
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
