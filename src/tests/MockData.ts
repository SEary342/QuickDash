import { LinkPage } from "../types/linkPage";

export const mockLinkPages: LinkPage[] = [
  {
    name: "test",
    groupList: [
      {
        name: "test45",
        linkList: [
          { text: "test", url: "http://github.com", color: "", outline: true },
          {
            text: "test3",
            url: "https://github.com",
            color: "amber",
            outline: false,
          },
        ],
        icon: "mdi-account",
        color: "red",
      },
      { name: "test", linkList: [], color: "blue", icon: "mdi-account" },
      { name: "test3", linkList: [] },
      { name: "test4", linkList: [] },
      { name: "test453", linkList: [] },
      { name: "test32", linkList: [] },
    ],
    icon: "mdi-account",
    color: "blue",
  },
  {
    name: "test2",
    groupList: [
      {
        name: "test",
        linkList: [
          {
            text: "test",
            url: "http://github.com",
            color: "blue",
            outline: true,
            icon: "mdi-chip",
          },
          {
            text: "test3",
            url: "https://github.com",
            color: "amber",
            outline: false,
          },
        ],
        icon: "mdi-account",
        color: "red",
      },
    ],
    icon: "mdi-account",
    color: "amber",
  },
  { name: "Test3", groupList: [], color: "brown", icon: "mdi-death-star" },
  {
    name: "yrd",
    groupList: [],
    color: "black",
    icon: "mdi-file-document-outline",
  },
];
