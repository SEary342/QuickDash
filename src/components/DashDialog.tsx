import { LinkPage } from "../types/linkPage";
import { Dialog } from "./Dialog";
import { InputWithLabel } from "./InputWithLabel";
import { useEffect, useState } from "react";
import { SelectWithLabel } from "./SelectWithLabel";
import { iconOptionsArray } from "../types/icons";
import { colorOptionsArray } from "../types/colors";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const defaultDash: () => LinkPage = () => ({ name: "", groupList: [] });
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
  linkPage = defaultDash(),
  onClose,
}: {
  isOpen: boolean;
  editMode?: boolean;
  linkPage?: LinkPage;
  onClose: (linkPage?: LinkPage) => void;
}) => {
  const [name, setName] = useState(linkPage.name);
  const [color, setColor] = useState(linkPage.color);
  const [icon, setIcon] = useState(linkPage.icon);
  const linkPageNames = useSelector((state: RootState) => state.linkPages)
    .filter((pg) => pg.name != linkPage.name)
    .map((pg) => pg.name.toLowerCase());
  const isDuplicate = linkPageNames.includes(name.trim().toLowerCase());
  const nameExists = name.trim().length > 0;

  const title = editMode ? "Edit Dash" : "Add Dash";

  useEffect(() => {
    if (!isOpen) {
      const reset = defaultDash();
      setName(reset.name);
      setColor(reset.color);
      setIcon(reset.icon);
    }
  }, [isOpen]);

  const handleClose = (confirm: boolean) => {
    if (confirm) {
      setName(name.trim());
      onClose({ ...linkPage, name, color, icon });
    } else {
      onClose(undefined);
    }
  };

  // TODO Disable confirm if nothing has been changed (edit mode)
  // TODO add delete button for edit mode
  return (
    <Dialog
      title={title}
      isOpen={isOpen}
      onClose={handleClose}
      disableConfirm={isDuplicate || !nameExists}
    >
      <InputWithLabel
        id="dashName"
        value={name}
        type="text"
        onInputChange={(e) => setName(e.target.value)}
        className="my-2"
        hasError={isDuplicate}
      >
        Dash Name
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
