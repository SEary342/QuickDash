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

export const ColorOptionArray = colorOptionKeys.map(k => {
  return {
    text: k.replace(/[A-Z]/g, m => "-" + m).slice(1),
    value: Object(ColorOption)[k]
  };
});

export class LinkData {
  text: string;
  url: string;
  color: ColorOption;

  constructor(text: string, url: string, color?: ColorOption) {
    this.text = text;
    this.url = url;
    if (color) {
      this.color = color;
    } else {
      this.color = ColorOption.Dark;
    }
  }
}

export class LinkGroup {
  name: string;
  linkList: LinkData[];

  constructor(name: string, linkList?: LinkData[]) {
    this.name = name;
    if (linkList) {
      this.linkList = linkList;
    } else {
      this.linkList = [];
    }
  }
}

export class LinkPage {
  name: string;
  groupList: LinkGroup[];

  constructor(name: string, groupList?: LinkGroup[]) {
    this.name = name;
    if (groupList) {
      this.groupList = groupList;
    } else {
      this.groupList = [];
    }
  }
}
