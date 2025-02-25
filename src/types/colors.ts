interface colorStruct {
  background: string;
  hoverColor: string;
  border: string;
  text: string;
  icon: string;
}
// TODO fill in the lookup
export const colorMap: { [key: string]: colorStruct } = {
  red: {
    background: "bg-red-600",
    hoverColor: "hover:bg-red-700",
    border: "border-red-600",
    text: "text-red-600",
    icon: "red",
  },
};
