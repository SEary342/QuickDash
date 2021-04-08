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

export class LinkData {
  text: string;
  url: string;
  color: string;

  constructor(text: string, url: string, color?: ColorOption | string) {
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
  name: string | null;
  linkList: LinkData[];

  constructor(name: string | null, linkList?: LinkData[]) {
    this.name = name;
    if (linkList) {
      this.linkList = linkList;
    } else {
      this.linkList = [];
    }
  }

  addLink(text: string, url: string, color: string) {
    if (
      !this.linkList
        .map((x) => x.text.toLowerCase())
        .includes(text.toLowerCase())
    ) {
      this.linkList.push(new LinkData(text, url, color));
    } else {
      throw new Error(`A link with text: '${text}' already exists.`);
    }
  }

  editLink(originalText: string, text: string, url: string, color: string) {
    const link = this.linkList.find((x) => x.text === originalText);
    if (link === undefined) {
      throw new Error(`A link with text: '${text}' cannot be found.`);
    } else {
      link.text = text;
      link.url = url;
      link.color = color;
    }
  }

  deleteLink(text: string) {
    const itemIndex = this.linkList.findIndex((x) => x.text === text);
    if (itemIndex !== -1) {
      this.linkList.splice(itemIndex, 1);
    } else {
      throw new Error(`A link with text: '${text}' cannot be found.`);
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

  addGroup(name: string, linkList?: LinkData[]) {
    if (!this.groupList.map((x) => x.name).includes(name)) {
      this.groupList.push(new LinkGroup(name, linkList));
    } else {
      throw new Error(`A group with name: '${name}' already exists.`);
    }
  }

  editGroup(name: string, newName: string) {
    const grp = this.groupList.find((x) => x.name === name);
    if (grp === undefined) {
      throw new Error(`A group with name: '${name}' cannot be found.`);
    } else {
      grp.name = newName;
    }
  }

  deleteGroup(name: string) {
    const grpIndex = this.groupList.findIndex((x) => x.name === name);
    if (grpIndex !== -1) {
      this.groupList.splice(grpIndex, 1);
    } else {
      throw new Error(`A group with name: '${name}' cannot be found.`);
    }
  }
}
