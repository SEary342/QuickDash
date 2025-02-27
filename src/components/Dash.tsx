import Icon from "@mdi/react";
import { LinkPage } from "../types/linkPage";
import { iconTranslation } from "../types/icons";
import { colorMap } from "../types/colors";
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

const TabBtn = ({
  id,
  linkPage,
  chevronLeft,
  chevronRight,
  tabSelectFunc,
}: {
  id: number;
  linkPage: LinkPage;
  chevronLeft: boolean;
  chevronRight: boolean;
  tabSelectFunc: (id: number) => void;
}) => {
  const [tabEdit, setTabEdit] = useState(false);
  const colorLookup = linkPage.color
    ? colorMap[linkPage.color]
    : colorMap["unknown"];

  return (
    <motion.li
      className={`me-2 flex flex-row rounded-t-xl ${colorLookup.background} overflow-hidden`}
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
        className={`relative flex items-center border-white border-2 rounded-full my-2 transition-all duration-200 px-2 mr-3 ${colorLookup.text}`}
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
                path={mdiPencil}
                color={colorLookup.icon}
                tooltipText="Edit Dash"
                tooltipPosition="bottom"
              />
              {chevronLeft && (
                <IconBtn
                  path={mdiChevronLeft}
                  color={colorLookup.icon}
                  tooltipText="Move Dash Left"
                  tooltipPosition="bottom"
                />
              )}
              {chevronRight && (
                <IconBtn
                  path={mdiChevronRight}
                  color={colorLookup.icon}
                  tooltipText="Move Dash Right"
                  tooltipPosition="bottom"
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
        <IconBtn
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

const Dash = ({
  linkPages,
  columns = 3,
}: {
  linkPages: LinkPage[];
  columns?: number;
}) => {
  const [pageIndex, setPageIndex] = useState(0); // TODO: This will need to come out of local storage
  const renderedPage = linkPages[pageIndex];

  const groupList = renderedPage ? renderedPage.groupList : [];

  // Compute total links across all groups
  const totalLinks = groupList.reduce((sum, gp) => sum + gp.linkList.length, 0);
  const avgLinksPerColumn = Math.ceil(totalLinks / columns);

  // Distribute groups into columns while maintaining balanced link count
  const columnGroups: LinkGroup[][] = Array.from({ length: columns }, () => []);
  let currentColumn = 0;
  const linksInColumn = Array(columns).fill(0);

  for (const group of groupList) {
    if (
      currentColumn < columns - 1 &&
      linksInColumn[currentColumn] + group.linkList.length > avgLinksPerColumn
    ) {
      currentColumn++;
    }
    columnGroups[currentColumn].push(group);
    linksInColumn[currentColumn] += group.linkList.length;
  }

  const flattenedGroups = columnGroups.flat();
  const totalGroups = flattenedGroups.length;

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
              tabSelectFunc={setPageIndex}
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
