import { LinkPage } from "../types/linkPage";
import { Dialog } from "./Dialog/Dialog";
import { InputWithLabel } from "./InputWithLabel/InputWithLabel";
import { useEffect, useMemo, useState } from "react";
import { SelectWithLabel } from "./SelectWithLabel";
import { iconOptionsArray } from "../types/icons";
import { colorOptionsArray } from "../types/colors";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { ConfirmDialog } from "./ConfirmDialog/ConfirmDialog";
import { LinkGroup } from "../types/linkGroup";

const defaultDash: () => LinkPage = () => ({ name: "", groupList: [] });
const defaultGroup: () => LinkGroup = () => ({ name: "", linkList: [] });
const colorSelect = colorOptionsArray.map(({ title, label }) => ({
  value: label,
  label: title,
  color: true,
  icon: false,
}));
const iconSelect = iconOptionsArray.map(({ title, value }) => ({
  value,
  label: title,
  color: false,
  icon: true,
}));

const PanelDialog = ({
  isOpen,
  editMode = false,
  groupMode = false,
  linkPage = defaultDash(),
  linkGroup = defaultGroup(),
  pageId,
  onClose,
}: {
  isOpen: boolean;
  editMode?: boolean;
  groupMode?: boolean;
  linkPage?: LinkPage;
  linkGroup?: LinkGroup;
  pageId?: number;
  onClose: (
    linkPage?: LinkPage,
    linkGroup?: LinkGroup,
    remove?: boolean
  ) => void;
}) => {
  const dialogName = groupMode ? "Group" : "Dash";
  const initialState = groupMode ? linkGroup : linkPage;
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [name, setName] = useState(initialState.name);
  const [color, setColor] = useState(initialState.color);
  const [icon, setIcon] = useState(initialState.icon);
  const linkPages = useSelector((state: RootState) => state.linkPages);

  const existingNames = useMemo(() => {
    const names: string[] = [];

    if (
      pageId !== undefined &&
      pageId >= 0 &&
      linkPages[pageId] !== undefined
    ) {
      linkPages[pageId].groupList.forEach((gp) => {
        if (gp.name !== linkGroup.name) {
          names.push(gp.name.toLowerCase());
        }
      });
    } else {
      linkPages.forEach((pg) => {
        if (pg.name !== linkPage.name) {
          names.push(pg.name.toLowerCase());
        }
      });
    }

    return names;
  }, [linkPages, pageId, linkGroup.name, linkPage.name]);

  const isDuplicate = existingNames.includes(name.trim().toLowerCase());
  const nameExists = name.trim().length > 0;
  const hasChanged =
    name != initialState.name ||
    color != initialState.color ||
    icon != initialState.icon;

  const title = editMode ? `Edit ${dialogName}` : `Add ${dialogName}`;

  useEffect(() => {
    if (!isOpen && !editMode) {
      const reset = groupMode ? defaultGroup() : defaultDash();
      setName(reset.name);
      setColor(reset.color);
      setIcon(reset.icon);
    }
  }, [isOpen, editMode, groupMode]);

  const handleClose = (confirm: boolean) => {
    if (!confirm) return onClose(undefined);
    setName(name.trim());
    onClose(
      groupMode ? linkPage : { ...linkPage, name, color, icon },
      groupMode ? { ...linkGroup, name, color, icon } : linkGroup,
      false
    );
  };

  return (
    <Dialog
      title={title}
      isOpen={isOpen}
      onClose={handleClose}
      disableConfirm={!nameExists || isDuplicate || (editMode && !hasChanged)}
      actionButton={
        editMode
          ? {
              action: () => {
                setConfirmOpen(true);
              },
              text: "Delete",
              color: "bg-red-600 hover:bg-red-700 text-white",
            }
          : undefined
      }
    >
      <ConfirmDialog
        isOpen={confirmOpen}
        message={`Delete this ${dialogName}?`}
        onConfirm={(confirmed) => {
          setConfirmOpen(false);
          if (confirmed) {
            onClose(linkPage, linkGroup, true);
          }
        }}
      />
      <InputWithLabel
        id="dashGroupName"
        value={name}
        type="text"
        onInputChange={(e) => setName(e.target.value)}
        className="my-2"
        hasError={isDuplicate}
      >
        {dialogName} Name
      </InputWithLabel>
      <SelectWithLabel
        id="color"
        value={color}
        options={colorSelect}
        onChange={(val) => setColor(val)}
        className="my-2"
      >
        Color
      </SelectWithLabel>
      <SelectWithLabel
        id="icon"
        value={icon}
        options={iconSelect}
        onChange={(val) => setIcon(val)}
        className="my-2"
      >
        Icon
      </SelectWithLabel>
    </Dialog>
  );
};

export default PanelDialog;
