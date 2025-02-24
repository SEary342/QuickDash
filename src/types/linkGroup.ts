import { LinkData } from "./linkData";

export interface LinkGroup {
  name: string;
  linkList: LinkData[];
  icon?: string;
  color?: string;
}
