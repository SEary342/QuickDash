import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LinkPage } from "../types/linkPage";
import { LinkGroup } from "../types/linkGroup";
import { LinkData } from "../types/linkData";

// Local Storage Key
const LOCAL_STORAGE_KEY = "app";
// Load State from Local Storage
const loadState = (): {
  selectedDash: string;
  linkPages: LinkPage[];
  numberOfColumns: number;
} => {
  try {
    const storedState = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedState) {
      const parsedState = JSON.parse(storedState);
      return {
        selectedDash: parsedState.selectedDash || "",
        linkPages: parsedState.quickDashConfig || [],
        numberOfColumns: parsedState.numberOfColumns ?? 3,
      };
    }
  } catch (error) {
    console.error("Error loading state from localStorage:", error);
  }
  return { selectedDash: "", linkPages: [], numberOfColumns: 3 };
};

// Initial state
const initialState = loadState();

// Slice for app state
const appSlice = createSlice({
  name: "app",
  initialState: {
    selectedDash: initialState.selectedDash,
    numberOfColumns: initialState.numberOfColumns,
  },
  reducers: {
    setSelectedDash(state, action: PayloadAction<string>) {
      state.selectedDash = action.payload;
    },
    setNumberOfColumns(state, action: PayloadAction<number>) {
      state.numberOfColumns = action.payload;
    },
  },
});

// Slice for managing link pages
const linkPageSlice = createSlice({
  name: "linkPages",
  initialState: initialState.linkPages,
  reducers: {
    overwriteConfig(state, action: PayloadAction<LinkPage[]>) {
      state = action.payload;
    },
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

export const { setSelectedDash, setNumberOfColumns } = appSlice.actions;
export const {
  overwriteConfig,
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

// Configure Store
const store = configureStore({
  reducer: {
    app: appSlice.reducer,
    linkPages: linkPageSlice.reducer,
  },
});

// Subscribe to store changes and update local storage
store.subscribe(() => {
  try {
    const state = store.getState();
    const persistedState = {
      selectedDash: state.app.selectedDash,
      quickDashConfig: state.linkPages, // Still using legacy key
      numberOfColumns: state.app.numberOfColumns,
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(persistedState));
  } catch (error) {
    console.error("Error saving state to localStorage:", error);
  }
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
