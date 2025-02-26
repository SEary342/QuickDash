interface colorStruct {
  background: string;
  hoverColor: string;
  border: string;
  outlineBorder: string;
  text: string;
  outlineText: string;
  icon: string;
  outlineIcon: string;
  focus: string;
}
// TODO fill in the lookup
export const colorMap: { [key: string]: colorStruct } = {
  red: {
    background: "bg-red-600",
    hoverColor: "hover:bg-red-700",
    border: "border-white",
    outlineBorder: "border-red-600",
    text: "text-white",
    outlineText: "text-red-600",
    icon: "white",
    outlineIcon: "red",
    focus: "focus:outline-white",
  },
  unknown: {
    background: "bg-gray-200",
    hoverColor: "bg-gray-300",
    border: "border-black",
    outlineBorder: "border-black",
    text: "text-black",
    outlineText: "text-black",
    icon: "black",
    outlineIcon: "black",
    focus: "focus:outline-black",
  },
};
