import { useState, useEffect } from "react";
import { Dialog } from "./Dialog/Dialog";
import { InputWithLabel } from "./InputWithLabel/InputWithLabel";
import { SelectWithLabel } from "./SelectWithLabel";
import { ConfirmDialog } from "./ConfirmDialog/ConfirmDialog";
import { iconOptionsArray } from "../types/icons";
import { colorOptionsArray } from "../types/colors";
import Link from "./Link";
import { LinkData } from "../types/linkData";
import { RootState } from "../store/store";
import { useSelector } from "react-redux";

const validUrl = (v: string) => {
  let url;
  try {
    url = new URL(v);
  } catch {
    return "URL is not valid";
  }
  return ["http:", "https:"].includes(url.protocol) || "URL protocol not valid";
};

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

const LinkDialog = ({
  pageId,
  panelId,
  isOpen,
  editMode = false,
  link = { text: "", url: "", color: "", outline: false, icon: "" },
  onClose,
}: {
  pageId: number;
  panelId: number;
  isOpen: boolean;
  editMode: boolean;
  link?: LinkData;
  onClose: (link?: LinkData, remove?: boolean) => void;
}) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [name, setName] = useState(link.text);
  const [url, setUrl] = useState(link.url);
  const [color, setColor] = useState(link.color);
  const [outlined, setOutlined] = useState(link.outline);
  const [icon, setIcon] = useState(link.icon);

  const linkPages = useSelector((state: RootState) => state.linkPages);

  const existingNames = linkPages[pageId].groupList[panelId].linkList.map(
    (lnk) => lnk.text.trim().toLowerCase()
  );

  const urlValid = validUrl(url);
  const isDuplicate =
    link.text != name && existingNames.includes(name?.trim().toLowerCase());

  const hasChanged =
    name !== link.text ||
    url !== link.url ||
    color !== link.color ||
    outlined !== link.outline ||
    icon !== link.icon;

  const resetDialog = () => {
    setName(link.text);
    setUrl(link.url);
    setColor(link.color);
    setOutlined(link.outline);
    setIcon(link.icon);
  };

  useEffect(() => {
    if (!isOpen && !editMode) {
      setName("");
      setUrl("");
      setColor("");
      setOutlined(false);
      setIcon("");
    }
  }, [isOpen, editMode]);

  const handleClose = (confirm: boolean) => {
    if (!confirm) {
      onClose(undefined);
    } else {
      onClose(
        { text: name, url: url, color: color, outline: outlined, icon: icon },
        false
      );
    }
    resetDialog();
  };

  return (
    <Dialog
      title={editMode ? "Edit Link" : "Add Link"}
      isOpen={isOpen}
      onClose={handleClose}
      disableConfirm={
        !name ||
        !url ||
        urlValid !== true ||
        isDuplicate ||
        (editMode && !hasChanged)
      }
      actionButton={
        editMode
          ? {
              action: () => setConfirmOpen(true),
              text: "Delete",
              color: "bg-red-600 hover:bg-red-700 text-white",
            }
          : undefined
      }
    >
      <ConfirmDialog
        isOpen={confirmOpen}
        message="Delete this Link?"
        onConfirm={(confirmed) => {
          setConfirmOpen(false);
          if (confirmed) {
            onClose(link, true);
          }
        }}
      />
      <InputWithLabel
        id="linkName"
        hasError={isDuplicate}
        value={name}
        type="text"
        onInputChange={(e) => setName(e.target.value)}
        className="my-2"
      >
        Link Name
      </InputWithLabel>
      <InputWithLabel
        errorText={urlValid}
        hasError={urlValid !== true}
        id="linkUrl"
        value={url}
        type="text"
        onInputChange={(e) => setUrl(e.target.value)}
        className="my-2"
      >
        Link URL
      </InputWithLabel>
      <SelectWithLabel
        id="color"
        value={color}
        options={colorSelect}
        onChange={setColor}
        className="my-2"
      >
        Color
      </SelectWithLabel>
      <SelectWithLabel
        id="icon"
        value={icon}
        options={iconSelect}
        onChange={setIcon}
        className="my-2"
      >
        Icon
      </SelectWithLabel>
      <div className="flex items-center my-2">
        <input
          id="outlined"
          type="checkbox"
          checked={outlined}
          onChange={(e) => setOutlined(e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="outlined">Outlined</label>
      </div>
      <div className="mt-4 p-4 border rounded">
        <p className="text-sm mb-2">Preview:</p>
        <Link
          pageId={-1}
          panelId={-1}
          id={-1}
          item={{
            text: name,
            color: color,
            outline: outlined,
            icon: icon,
            url: url,
          }}
        />
      </div>
    </Dialog>
  );
};

export default LinkDialog;
