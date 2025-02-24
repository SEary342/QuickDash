interface colorStruct {
  background: string;
  border: string;
  text: string;
  icon: string;
}
// TODO fill in the lookup
export const colorMap: { [key: string]: colorStruct } = {
  red: {
    background: "bg-red-600",
    border: "border-red-600",
    text: "text-red-600",
    icon: "red",
  },
};
