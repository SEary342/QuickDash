// TODO fix these color options and integrate into the menu dropdowns (make it not an enum)
export enum ColorOption {
    Green = "success",
    Blue = "primary",
    Grey = "secondary",
    Yellow = "warning",
    Red = "danger",
    Teal = "info",
    Dark = "dark",
    GreenOutline = "outline-success",
    BlueOutline = "outline-primary",
    GreyOutline = "outline-secondary",
    YellowOutline = "outline-warning",
    RedOutline = "outline-danger",
    TealOutline = "outline-info",
    DarkOutline = "outline-dark"
  }
  
  const colorOptionKeys = Object.keys(ColorOption);
  colorOptionKeys.sort();
  
  export const ColorOptionArray = colorOptionKeys.map((k) => {
    return {
      text: k.replace(/[A-Z]/g, (m) => "-" + m).slice(1),
      value: Object(ColorOption)[k]
    };
  });
  
  export interface LinkData {
    text: string;
    url: string;
    color: string;
    outline: boolean;
    icon?: string;
  }
  
  export interface LinkGroup {
    name: string;
    linkList: LinkData[];
  }

  export interface LinkPage {
    name: string;
    groupList: LinkGroup[];
  }