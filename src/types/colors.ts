export interface colorStruct {
  name: string;
  background: string;
  hoverColor: string;
  border: string;
  outlineBorder: string;
  text: string;
  outlineText: string;
  focus: string;
}

const colorMap: { [key: string]: colorStruct } = {
  red: {
    name: "Red",
    background: "bg-red-600",
    hoverColor: "hover:bg-red-700",
    border: "border-white",
    outlineBorder: "border-red-600",
    text: "text-white",
    outlineText: "text-red-600",
    focus: "focus:outline-white",
  },
  green: {
    name: "Green",
    background: "bg-green-600",
    hoverColor: "hover:bg-green-700",
    border: "border-white",
    outlineBorder: "border-green-600",
    text: "text-white",
    outlineText: "text-green-600",
    focus: "focus:outline-white",
  },
  "grey-lighten-4": {
    name: "Light Grey",
    background: "bg-gray-500",
    hoverColor: "hover:bg-gray-600",
    border: "border-black",
    outlineBorder: "border-gray-500",
    text: "text-black",
    outlineText: "text-gray-500",
    focus: "focus:outline-white",
  },
  "light-green": {
    name: "Light Green",
    background: "bg-lime-500",
    hoverColor: "hover:bg-lime-600",
    border: "border-white",
    outlineBorder: "border-lime-500",
    text: "text-white",
    outlineText: "text-lime-500",
    focus: "focus:outline-white",
  },
  lime: {
    name: "Lime",
    background: "bg-lime-400",
    hoverColor: "hover:bg-lime-500",
    border: "border-black",
    outlineBorder: "border-lime-400",
    text: "text-black",
    outlineText: "text-lime-400",
    focus: "focus:outline-black",
  },
  amber: {
    name: "Amber",
    background: "bg-amber-500",
    hoverColor: "hover:bg-amber-600",
    border: "border-black",
    outlineBorder: "border-amber-500",
    text: "text-black",
    outlineText: "text-amber-500",
    focus: "focus:outline-black",
  },
  yellow: {
    name: "Yellow",
    background: "bg-yellow-400",
    hoverColor: "hover:bg-yellow-500",
    border: "border-black",
    outlineBorder: "border-yellow-400",
    text: "text-black",
    outlineText: "text-yellow-400",
    focus: "focus:outline-black",
  },
  teal: {
    name: "Teal",
    background: "bg-teal-400",
    hoverColor: "hover:bg-teal-500",
    border: "border-black",
    outlineBorder: "border-teal-400",
    text: "text-black",
    outlineText: "text-teal-400",
    focus: "focus:outline-black",
  },
  orange: {
    name: "Orange",
    background: "bg-orange-500",
    hoverColor: "hover:bg-orange-600",
    border: "border-black",
    outlineBorder: "border-orange-500",
    text: "text-black",
    outlineText: "text-orange-500",
    focus: "focus:outline-black",
  },
  "deep-orange": {
    name: "Dark Orange",
    background: "bg-orange-700",
    hoverColor: "hover:bg-orange-800",
    border: "border-white",
    outlineBorder: "border-orange-700",
    text: "text-white",
    outlineText: "text-orange-700",
    focus: "focus:outline-white",
  },
  brown: {
    name: "Brown",
    background: "bg-amber-900",
    hoverColor: "hover:bg-amber-950",
    border: "border-white",
    outlineBorder: "border-amber-900",
    text: "text-white",
    outlineText: "text-amber-900",
    focus: "focus:outline-white",
  },
  "blue-grey": {
    name: "Blue Grey",
    background: "bg-gray-700",
    hoverColor: "hover:bg-gray-800",
    border: "border-white",
    outlineBorder: "border-gray-700",
    text: "text-white",
    outlineText: "text-gray-700",
    focus: "focus:outline-white",
  },
  white: {
    name: "White",
    background: "bg-white",
    hoverColor: "hover:bg-gray-100",
    border: "border-black",
    outlineBorder: "border-white",
    text: "text-black",
    outlineText: "text-white",
    focus: "focus:outline-black",
  },
  black: {
    name: "Black",
    background: "bg-black",
    hoverColor: "hover:bg-gray-900",
    border: "border-white",
    outlineBorder: "border-black",
    text: "text-white",
    outlineText: "text-black",
    focus: "focus:outline-white",
  },
  pink: {
    name: "Pink",
    background: "bg-rose-400",
    hoverColor: "hover:bg-rose-450",
    border: "border-black",
    outlineBorder: "border-rose-400",
    text: "text-black",
    outlineText: "text-rose-400",
    focus: "focus:outline-black",
  },
  blue: {
    name: "Blue",
    background: "bg-blue-600",
    hoverColor: "hover:bg-blue-700",
    border: "border-white",
    outlineBorder: "border-blue-600",
    text: "text-white",
    outlineText: "text-blue-600",
    focus: "focus:outline-white",
  },
  unknown: {
    name: "Unknown",
    background: "bg-gray-200",
    hoverColor: "hover:bg-gray-300",
    border: "border-black",
    outlineBorder: "border-black",
    text: "text-black",
    outlineText: "text-black",
    focus: "focus:outline-black",
  },
};

export const getColorLookup = (color?: string) => {
  if (color) {
    const colorLookup = colorMap[color];
    if (colorLookup) {
      return colorLookup;
    }
  }
  return colorMap["unknown"];
};

export const colorOptionsArray = Object.entries(colorMap)
  .map(([label, value]) => ({ label, title: value.name }))
  .sort((a, b) => a.title.localeCompare(b.title));

export const colorConversions: { [key: string]: string } = {
  Danger: "red",
  Info: "teal",
  Warning: "yellow",
  Secondary: "grey",
  Primary: "blue",
  Success: "green",
};
