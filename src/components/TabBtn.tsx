import Icon from "@mdi/react";
import { Dialog } from "./Dialog";
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
import { motion, AnimatePresence } from "motion/react";
import { useDispatch } from "react-redux";
import { reorderLinkPages } from "../store/store";

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
        selected
          ? `border-3 ${
              colorLookup.border == "border-white"
                ? "border-gray-600"
                : colorLookup.border
            }`
          : ""
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

export default TabBtn;
