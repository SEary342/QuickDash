import { LinkPage } from "../types/linkPage";
import { Dialog } from "./Dialog";
import { InputWithLabel } from "./InputWithLabel";
import { useState } from "react";
import { SelectWithLabel } from "./SelectWithLabel";
import { iconOptionsArray } from "../types/icons";
import { colorOptionsArray } from "../types/colors";

const defaultDash: () => LinkPage = () => ({ name: "", groupList: [] });
const colorSelect = colorOptionsArray.map(({ title, label }) => ({
  value: label,
  label :title,
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

  const title = editMode ? "Edit Dash" : "Add Dash";

  const handleClose = () => {
    // TODO handle no-op changes
    // TODO wire up the confirm button on the dialog.
    onClose({ ...linkPage, name });
  };

  return (
    <Dialog title={title} isOpen={isOpen} onClose={handleClose}>
      <InputWithLabel
        id="dashName"
        value={name}
        type="text"
        onInputChange={(e) => setName(e.target.value)}
        className="my-2"
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
