export const colorOptions = {
  "Light-Grey": "grey-lighten-4",
  Green: "green",
  Blue: "blue",
  Grey: "grey",
  Yellow: "yellow",
  Red: "red",
  Pink: "pink",
  Purple: "purple",
  "Deep Purple": "deep-purple",
  Indigo: "indigo",
  Cyan: "cyan",
  Dark: "grey-darken-4",
  Teal: "teal"
};

export const colorOptionsArray = Object.entries(colorOptions).map((x) => ({
  title: x[0],
  value: x[1]
}));
colorOptionsArray.sort((a, b) => a.title.localeCompare(b.title));

export const iconOptions = {
  "Death Star": "mdi-death-star",
  Account: "mdi-account",
  Chip: "mdi-chip",
  Link: "mdi-link-variant",
  Security: "mdi-shield-lock-outline",
  Server: "mdi-server",
  Jira: "mdi-jira",
  Ideas: "mdi-lightbulb-group-outline",
  Food: "mdi-baguette",
  Drink: "mdi-coffee-outline",
  Earth: "mdi-earth"
};

export const iconOptionsArray = Object.entries(iconOptions).map((x) => ({
  title: x[0],
  value: x[1]
}));
iconOptionsArray.sort((a, b) => a.title.localeCompare(b.title));

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
  icon?: string;
  color?: string;
}

export interface LinkPage {
  name: string;
  groupList: LinkGroup[];
  icon?: string;
  color?: string;
}
