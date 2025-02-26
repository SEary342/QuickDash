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
    <li
      className={`me-2 flex flex-row rounded-t-xl ${colorLookup.background} transition-all duration-300 ease-in-out overflow-hidden`}
    >
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

      <div className="rounded-full border-white border-2 flex flex-row items-center px-2 my-3 mr-2 transition-all duration-300 ease-in-out min-w-[40px]">
        <div
          className={`flex flex-row gap-2 items-center transition-all duration-300 ease-in-out transform ${
            tabEdit
              ? "scale-x-100 opacity-100 w-auto"
              : "scale-x-0 opacity-0 w-0"
          }`}
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
        </div>

        <IconBtn
          path={mdiPlaylistEdit}
          color={colorLookup.icon}
          tooltipText={tabEdit ? "Hide Controls" : "Show Controls"}
          tooltipPosition="bottom"
          onClick={() => setTabEdit(!tabEdit)}
        />
      </div>
    </li>
  );
};

const Dash = ({ linkPages }: { linkPages: LinkPage[] }) => {
  const [pageIndex, setPageIndex] = useState(0); // TODO this will need to come out of local storage
  const renderedPage = linkPages[pageIndex];
  return (
    <>
      <div className="border-b border-gray-200 dark:border-gray-700">
        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
          {linkPages.map((pg, idx) => (
            <TabBtn
              key={`${pg.name}-${idx}`}
              id={idx}
              linkPage={pg}
              chevronLeft={idx != 0}
              chevronRight={idx < linkPages.length - 1}
              tabSelectFunc={(id) => setPageIndex(id)}
            />
          ))}
        </ul>
      </div>
      <div>
        {renderedPage.groupList.map((gp, idx) => (
          <LinkPanel
            key={`${gp.name}-${idx}`}
            linkGroup={gp}
            moveUp={idx > 0}
            moveDown={idx < renderedPage.groupList.length - 1}
          />
        ))}
      </div>
    </>
  );
};

export default Dash;
