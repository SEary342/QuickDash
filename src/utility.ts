import { LinkGroup, LinkPage } from "./configStructure";

declare global {
  interface Navigator {
    msSaveBlob?: (blob: any, defaultName?: string) => boolean;
  }
}

interface QDConfig {
  QuickDashConfig: LinkPage[];
  NumberOfColumns: number;
  QuickDashSelected: number;
}

export function exportConfig(exportFileName: string, fileExtension: string, exportData: LinkPage[] | LinkGroup[]) {
  const jsonFile = JSON.stringify(exportData);
  const blob = new Blob([jsonFile], { type: "application/json" });
  if (navigator.msSaveBlob) {
    // IE 10+
    navigator.msSaveBlob(blob, exportFileName);
  } else {
    const link = document.createElement("a");
    if (link.download !== undefined) {
      // feature detection
      // Browsers that support HTML5 download attribute
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", exportFileName.concat(fileExtension));
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}

export function readFile(uploadFile: File): Promise<LinkGroup[] | QDConfig> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(JSON.parse(String(reader.result)));
    };
    reader.onerror = reject;
    reader.readAsText(uploadFile);
  });
}
