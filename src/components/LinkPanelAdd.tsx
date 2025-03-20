import { mdiPlus } from "@mdi/js";
import { getColorLookup } from "../types/colors";
import IconBtn from "./IconBtn";
import { useState } from "react";
import PanelDialog from "./DashGroupDialog";
import { LinkPage } from "../types/linkPage";
import { LinkGroup } from "../types/linkGroup";
import { useDispatch } from "react-redux";
import { addLinkGroup } from "../store/store";

const colorLookup = getColorLookup("unknown");

export const LinkPanelAdd = ({ pageId }: { pageId: number }) => {
  const dispatch = useDispatch();
  const [addGroup, setAddGroup] = useState(false);
  return (
    <div className="rounded-md flex flex-col border border-black m-5">
      <div
        className={`flex flex-row w-full ${colorLookup.text} rounded-t-md px-3 py-3 items-center font-bold ${colorLookup.background}`}
      >
        <span className="ml-3 text-xl">Add Group</span>
        <IconBtn
          path={mdiPlus}
          size={0.8}
          tooltipText="Add Group"
          color=""
          className={`border-2 border-black ml-auto ${colorLookup.hoverColor}`}
          onClick={() => setAddGroup(true)}
        />
        <PanelDialog
          isOpen={addGroup}
          onClose={(_?: LinkPage, linkGroup?: LinkGroup) => {
            if (linkGroup) {
              dispatch(
                addLinkGroup({
                  pageIndex: pageId,
                  group: linkGroup,
                })
              );
            }
            setAddGroup(false);
          }}
          editMode={false}
          groupMode={true}
          pageId={pageId}
        />
      </div>
      <div className="pb-4"></div>
    </div>
  );
};
