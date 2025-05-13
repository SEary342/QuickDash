import { useState, ChangeEventHandler, DragEventHandler } from "react";
import { Dialog } from "./Dialog/Dialog";
import { LinkPage } from "../types/linkPage";
import { LinkGroup } from "../types/linkGroup";
import { LinkData } from "../types/linkData";
import { colorConversions } from "../types/colors";
import { useDispatch } from "react-redux";
import {
  setSelectedDash,
  overwriteConfig,
  setNumberOfColumns,
} from "../store/store";

interface FileImportDialogProps {
  isOpen: boolean;
  onClose: () => void;
}
const fileType = ".QDconfig";
function readFile(uploadFile: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(String(reader.result));
    };
    reader.onerror = reject;
    reader.readAsText(uploadFile);
  });
}

const FileImportDialog = ({ isOpen, onClose }: FileImportDialogProps) => {
  const dispatch = useDispatch();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState<boolean>(false);

  // Handles file drop
  const handleDrop: DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    setDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith(fileType)) {
      setSelectedFile(file);
    } else {
      alert(`Only ${fileType} files are allowed`);
    }
  };

  // Handles file selection from browse button
  const handleFileSelect: ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file && file.name.endsWith(fileType)) {
      setSelectedFile(file);
    } else {
      alert(`Only ${fileType} files are allowed`);
    }
  };

  // Handles drag enter
  const handleDragEnter = () => {
    setDragging(true);
  };

  // Handles drag leave
  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleConfirm = (confirm: boolean) => {
    if (confirm && selectedFile) {
      save();
    } else {
      onClose();
    }
    setSelectedFile(null);
  };

  const save = async () => {
    if (selectedFile) {
      // Ensure fileInput is not empty
      try {
        const data = await readFile(selectedFile);
        const tempObj = JSON.parse(data);
        let config = [];
        if (Array.isArray(tempObj)) {
          config = tempObj;
        } else {
          config = tempObj["QuickDashConfig"];
        }
        const tempConfig: LinkPage[] = [];
        for (const page of config) {
          const groupList: LinkGroup[] = [];
          for (const grp of page["groupList"]) {
            const linkList: LinkData[] = [];
            for (const lnk of grp["linkList"]) {
              let linkColor: string = lnk["color"];

              let outline = Boolean(lnk["outline"]);
              if (linkColor?.includes("outline")) {
                outline = true;
                linkColor = linkColor.replace("outline-", "");
              }
              if (linkColor in colorConversions) {
                linkColor = colorConversions[linkColor];
              }
              linkList.push({
                text: lnk["text"],
                url: lnk["url"],
                color: linkColor,
                outline: outline,
                icon: lnk["icon"],
              });
            }
            groupList.push({
              name: grp["name"],
              linkList: linkList,
              icon: grp["icon"],
              color: grp["color"],
            });
          }
          tempConfig.push({
            name: page["name"],
            groupList: groupList,
            icon: page["icon"],
            color: page["color"],
          });
        }
        dispatch(overwriteConfig(tempConfig));
        dispatch(setNumberOfColumns(3));
        dispatch(setSelectedDash(tempConfig[0].name));
        onClose();
      } catch (err) {
        console.log(err);
        alert("An import error occured");
      }
    }
  };

  return (
    <Dialog
      title={`Import ${fileType} File`}
      isOpen={isOpen}
      onClose={handleConfirm}
      disableConfirm={selectedFile === null}
    >
      <div
        className={`border-4 p-6 rounded-lg transition-all ${
          dragging
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 bg-gray-100"
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <p className="mb-4 text-center text-gray-700">
          Drag and drop your {fileType} file here, or
        </p>
        <div className="flex justify-center">
          <label
            htmlFor="fileInput"
            className="inline-block bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600 transition"
          >
            Browse Files
          </label>
        </div>
        <input
          type="file"
          id="fileInput"
          accept={fileType}
          className="hidden"
          onChange={handleFileSelect}
        />
        {selectedFile && (
          <div className="mt-4 text-center">
            <p className="text-green-500">Selected File: {selectedFile.name}</p>
          </div>
        )}
      </div>
    </Dialog>
  );
};

export default FileImportDialog;
