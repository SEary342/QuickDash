import { LinkPage } from "../types/linkPage";
import IconBtn from "./IconBtn";
import { mdiPlus } from "@mdi/js";
import { useLayoutEffect, useRef, useState } from "react";
import LinkPanel from "./LinkPanel";
import { LinkGroup } from "../types/linkGroup";
import { motion, AnimatePresence } from "motion/react";
import { useDispatch, useSelector } from "react-redux";
import {
  addLinkPage,
  deleteLinkPage,
  RootState,
  setSelectedDash,
} from "../store/store";

import PanelDialog from "./DashGroupDialog";
import TabBtn from "./TabBtn";
import { LinkPanelAdd } from "./LinkPanelAdd";
import QuickDashWelcome from "./QuickDashWelcome/QuickDashWelcome";

function distributeLinkGroups(
  linkGroups: LinkGroup[],
  groupsCount: number
): LinkGroup[][] {
  const weightedGroups = linkGroups.map((group) => ({
    ...group,
    weight: group.linkList.length + 1,
  }));

  const totalWeight = weightedGroups.reduce(
    (acc, group) => acc + group.weight,
    0
  );

  const targetWeightPerGroup = Math.floor(totalWeight / groupsCount);

  let currentGroupWeight = 0;
  let currentGroup: LinkGroup[] = [];
  const result: LinkGroup[][] = [];

  for (const group of weightedGroups) {
    currentGroup.push(group);
    currentGroupWeight += group.weight;

    if (
      currentGroupWeight >= targetWeightPerGroup ||
      weightedGroups.indexOf(group) === weightedGroups.length - 1
    ) {
      result.push(currentGroup);
      currentGroup = [];
      currentGroupWeight = 0;
    }
  }
  while (result.length < groupsCount) {
    result.push([]);
  }

  return result;
}

const Dash = ({ linkPages }: { linkPages: LinkPage[] }) => {
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

  const aboveScrollRef = useRef<HTMLDivElement>(null);
  const [scrollAreaHeight, setScrollAreaHeight] = useState<number | null>(null);

  useLayoutEffect(() => {
    const updateHeight = () => {
      if (aboveScrollRef.current) {
        const rect = aboveScrollRef.current.getBoundingClientRect();
        const offsetTop = rect.top; // Distance from top of viewport
        const height = rect.height;

        // Total space to subtract from 100vh
        const totalOffset = offsetTop + height;

        setScrollAreaHeight(window.innerHeight - totalOffset);
      }
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, [linkPages.length]);

  return (
    <>
      <div
        className="border-b border-gray-200 dark:border-gray-700"
        ref={aboveScrollRef}
      >
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
              onRemove={(id) => {
                const newPage =
                  selectedDash === linkPages[id].name
                    ? linkPages[id - 1]?.name || linkPages[id + 1]?.name || ""
                    : linkPages[id].name;
                dispatch(deleteLinkPage(id));
                dispatch(setSelectedDash(newPage));
              }}
            />
          ))}
          <li className="flex items-center justify-center">
            <IconBtn
              path={mdiPlus}
              className="cursor-pointer hover:bg-gray-300 rounded-full"
              tooltipText="Add Dash"
              tooltipPosition="right"
              color="text-black"
              onClick={() => setAddPage(!addPage)}
              size={1.5}
            />
            <PanelDialog
              isOpen={addPage}
              onClose={(linkPage?: LinkPage) => {
                if (linkPage) {
                  dispatch(addLinkPage(linkPage));
                  dispatch(setSelectedDash(linkPage.name));
                }
                setAddPage(false);
              }}
            />
          </li>
        </ul>
      </div>
      <div
        className="overflow-y-auto"
        style={{
          height: scrollAreaHeight !== null ? `${scrollAreaHeight}px` : "auto",
        }}
      >
        {linkPages.length == 0 && <QuickDashWelcome />}
        <AnimatePresence mode="wait">
          <motion.div
            key={pageIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid gap-4 mt-2"
            style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
          >
            {columnGroups.map((groupColumn, colIdx) => {
              const isFirstEmptyColumn =
                groupColumn.length === 0 &&
                columnGroups.findIndex((col) => col.length === 0) === colIdx;
              const isLastColumn = colIdx === columnGroups.length - 1;
              const shouldRenderAddPanel =
                linkPages.length > 0 &&
                (isFirstEmptyColumn ||
                  (isLastColumn &&
                    columnGroups.every((col) => col.length > 0)));
              return (
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
                  {shouldRenderAddPanel && <LinkPanelAdd pageId={pageIndex} />}
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
};

export default Dash;
