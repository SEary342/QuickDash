import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LinkPage } from "../types/linkPage";
import { LinkGroup } from "../types/linkGroup";
import { LinkData } from "../types/linkData";
import { testLinkPages } from "./testData";

// Initial state
const initialState: LinkPage[] = testLinkPages;

// Slice for managing link pages, link groups, and link data
const linkPageSlice = createSlice({
  name: "linkPages",
  initialState,
  reducers: {
    // CRUD operations for LinkPage
    addLinkPage(state, action: PayloadAction<LinkPage>) {
      state.push(action.payload);
    },
    updateLinkPage(
      state,
      action: PayloadAction<{ index: number; data: LinkPage }>
    ) {
      const { index, data } = action.payload;
      state[index] = data;
    },
    deleteLinkPage(state, action: PayloadAction<number>) {
      state.splice(action.payload, 1);
    },
    reorderLinkPages(
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) {
      const { fromIndex, toIndex } = action.payload;
      const [movedItem] = state.splice(fromIndex, 1);
      state.splice(toIndex, 0, movedItem);
    },

    // CRUD operations for LinkGroup within LinkPage
    addLinkGroup(
      state,
      action: PayloadAction<{ pageIndex: number; group: LinkGroup }>
    ) {
      const { pageIndex, group } = action.payload;
      state[pageIndex].groupList.push(group);
    },
    updateLinkGroup(
      state,
      action: PayloadAction<{
        pageIndex: number;
        groupIndex: number;
        group: LinkGroup;
      }>
    ) {
      const { pageIndex, groupIndex, group } = action.payload;
      state[pageIndex].groupList[groupIndex] = group;
    },
    deleteLinkGroup(
      state,
      action: PayloadAction<{ pageIndex: number; groupIndex: number }>
    ) {
      const { pageIndex, groupIndex } = action.payload;
      state[pageIndex].groupList.splice(groupIndex, 1);
    },
    reorderLinkGroups(
      state,
      action: PayloadAction<{
        pageIndex: number;
        fromIndex: number;
        toIndex: number;
      }>
    ) {
      const { pageIndex, fromIndex, toIndex } = action.payload;
      const [movedItem] = state[pageIndex].groupList.splice(fromIndex, 1);
      state[pageIndex].groupList.splice(toIndex, 0, movedItem);
    },

    // CRUD operations for LinkData within LinkGroup
    addLinkData(
      state,
      action: PayloadAction<{
        pageIndex: number;
        groupIndex: number;
        link: LinkData;
      }>
    ) {
      const { pageIndex, groupIndex, link } = action.payload;
      state[pageIndex].groupList[groupIndex].linkList.push(link);
    },
    updateLinkData(
      state,
      action: PayloadAction<{
        pageIndex: number;
        groupIndex: number;
        linkIndex: number;
        link: LinkData;
      }>
    ) {
      const { pageIndex, groupIndex, linkIndex, link } = action.payload;
      state[pageIndex].groupList[groupIndex].linkList[linkIndex] = link;
    },
    deleteLinkData(
      state,
      action: PayloadAction<{
        pageIndex: number;
        groupIndex: number;
        linkIndex: number;
      }>
    ) {
      const { pageIndex, groupIndex, linkIndex } = action.payload;
      state[pageIndex].groupList[groupIndex].linkList.splice(linkIndex, 1);
    },
    reorderLinkData(
      state,
      action: PayloadAction<{
        pageIndex: number;
        groupIndex: number;
        fromIndex: number;
        toIndex: number;
      }>
    ) {
      const { pageIndex, groupIndex, fromIndex, toIndex } = action.payload;
      const [movedItem] = state[pageIndex].groupList[
        groupIndex
      ].linkList.splice(fromIndex, 1);
      state[pageIndex].groupList[groupIndex].linkList.splice(
        toIndex,
        0,
        movedItem
      );
    },
  },
});

export const {
  addLinkPage,
  updateLinkPage,
  deleteLinkPage,
  reorderLinkPages,
  addLinkGroup,
  updateLinkGroup,
  deleteLinkGroup,
  reorderLinkGroups,
  addLinkData,
  updateLinkData,
  deleteLinkData,
  reorderLinkData,
} = linkPageSlice.actions;

const store = configureStore({
  reducer: {
    linkPages: linkPageSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
