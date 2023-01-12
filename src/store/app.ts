// Utilities
import { ref, computed } from "vue";
import { defineStore } from "pinia";

import { LinkGroup, LinkPage, LinkData } from "../configStructure";

const localStorage = window.localStorage;
function convertJSONtoGrpClasses(groupList: LinkGroup[]) {
  const outputList = [];
  for (const grp of groupList) {
    const newGrp = new LinkGroup(grp.name);
    for (const link of grp.linkList) {
      newGrp.linkList.push(new LinkData(link.text, link.url, link.color));
    }
    outputList.push(newGrp);
  }
  return outputList;
}

function convertJSONtoClasses(inputData: string | LinkPage[]) {
  let inputDataParsed: LinkPage[] = [];
  if (typeof inputData == "string") {
    inputDataParsed = JSON.parse(inputData);
  } else {
    inputDataParsed = inputData;
  }
  const conversionArray = [];
  for (const dash of inputDataParsed) {
    const newDash = new LinkPage(dash.name, convertJSONtoGrpClasses(dash.groupList));
    conversionArray.push(newDash);
  }
  return conversionArray;
}

export const useAppStore = defineStore(
  "app",
  () => {
    const selectedDash = ref(0);
    const quickDashConfig = ref<LinkPage[]>([]);
    const numberOfColumns = ref(3);

    const groupNames = computed(() =>
      quickDashConfig.value.map((dash) => dash.groupList.map((grp) => ({ dash: dash.name, grp: grp.name }))).flat()
    );
    const dashNames = computed(() => quickDashConfig.value.map((dash) => dash.name));

    function addEditDash(dashConfig: { name?: string; newDashName: string }) {
      if (dashConfig.name === undefined) {
        quickDashConfig.value.push(new LinkPage(dashConfig.newDashName));
      } else {
        const editDash = quickDashConfig.value.find((x) => x.name === dashConfig.name);
        if (editDash !== undefined) {
          editDash.name = dashConfig.newDashName;
        } else {
          throw new Error(`Cannot find dash: '${dashConfig.name}'`);
        }
      }
    }

    function bulkAddGroups(importGrpConfig: LinkPage) {
      const editDash = getEditDash(importGrpConfig.name);
      if (Array.isArray(importGrpConfig.groupList) && editDash) {
        const convGrps = convertJSONtoGrpClasses(importGrpConfig.groupList);
        for (const grp of convGrps) {
          editDash.addGroup(grp.name, grp.linkList);
        }
      } else {
        throw new Error("Invalid input data");
      }
    }

    function getEditDash(dashName: string) {
      return quickDashConfig.value.find((x) => x.name === dashName);
    }

    function getEditGrp(dashName: string, grpName: string) {
      return getEditDash(dashName)?.groupList.find((x) => x.name === grpName);
    }

    function deleteDash(dashName: string) {
      const dashIndex = quickDashConfig.value.findIndex((x) => x.name === dashName);
      if (dashIndex !== -1) {
        quickDashConfig.value.splice(dashIndex, 1);
      } else {
        throw new Error(`Cannot find dash: '${dashName}'`);
      }
    }

    return { addEditDash, selectedDash, quickDashConfig, numberOfColumns, dashNames, bulkAddGroups, deleteDash, groupNames };
  },
  {
    persist: {
      storage: localStorage,
      paths: ["selectedDash", "quickDashConfig", "numberOfColumns"],
    },
  }
);
/*
export const store = new Vuex.Store({
  state: {
    selectedDash: 0,
    quickDashConfig: [],
    numberOfColumns: 3,
  },
  mutations: {
    setSelectedDash(state, selectedDash) {
      state.selectedDash = selectedDash;
      updateDashSelected(state.selectedDash);
    },
    setQuickDashConfig(state, quickDashConfig) {
      state.quickDashConfig = quickDashConfig;
      if (state.selectedDash === null) {
        state.selectedDash = quickDashConfig[0].name;
        updateDashSelected(state.selectedDash);
      }
      updateDashConfig(state.quickDashConfig);
    },
    importConfig(state, importConfigData) {
      const importKeys = Object.keys(importConfigData);
      if (importKeys.includes("QuickDashConfig") && Array.isArray(importConfigData.QuickDashConfig)) {
        state.quickDashConfig = convertJSONtoClasses(importConfigData.QuickDashConfig, true);
        updateDashConfig(state.quickDashConfig);
        if (importKeys.includes("NumberOfColumns") && Number.isInteger(importConfigData.NumberOfColumns)) {
          state.numberOfColumns = importConfigData.NumberOfColumns;
          updateNumberOfColumns(state.numberOfColumns);
        }
        if (importKeys.includes("QuickDashSelected") && Number.isInteger(importConfigData.QuickDashSelected)) {
          state.selectedDash = importConfigData.QuickDashSelected;
          updateDashSelected(state.selectedDash);
        }
      }
    },
    setNumberOfColumns(state, numberOfColumns) {
      state.numberOfColumns = numberOfColumns;
      updateNumberOfColumns(state.numberOfColumns);
    },
    reorderGroup(state, reorderConfig) {
      const editGrp = getEditGrp(reorderConfig.dashName, reorderConfig.name, state.quickDashConfig);
      editGrp.linkList = [...reorderConfig.linkList];
      updateDashConfig(state.quickDashConfig);
    },
    addEditLink(state, linkConfig) {
      const editGrp = getEditGrp(linkConfig.dashName, linkConfig.dashGroup.name, state.quickDashConfig);
      if (linkConfig.initialName === null) {
        editGrp.addLink(linkConfig.name, linkConfig.url, linkConfig.color);
      } else {
        editGrp.editLink(linkConfig.initialName, linkConfig.name, linkConfig.url, linkConfig.color);
      }
      updateDashConfig(state.quickDashConfig);
    },
    deleteLink(state, linkConfig) {
      const editGrp = getEditGrp(linkConfig.dashName, linkConfig.dashGroup.name, state.quickDashConfig);
      editGrp.deleteLink(linkConfig.name);
      updateDashConfig(state.quickDashConfig);
    },
    addEditGroup(state, grpConfig) {
      const editDash = getEditDash(grpConfig.dash, state.quickDashConfig);
      if (grpConfig.name !== null) {
        editDash.editGroup(grpConfig.name, grpConfig.newName);
      } else {
        editDash.addGroup(grpConfig.newName);
      }
      updateDashConfig(state.quickDashConfig);
    },
    ,
    deleteGroup(state, grpConfig) {
      const editDash = getEditDash(grpConfig.dash, state.quickDashConfig);
      editDash.deleteGroup(grpConfig.name);
      updateDashConfig(state.quickDashConfig);
    },
  },
  getters: {
    selectedDash: (state) => state.selectedDash,
    quickDashConfig: (state) => state.quickDashConfig,
    numberOfColumns: (state) => state.numberOfColumns,
    exportData: (state) => {
      return {
        QuickDashConfig: state.quickDashConfig,
        NumberOfColumns: state.numberOfColumns,
        QuickDashSelected: state.selectedDash,
      };
    },
  },
});*/
/*
export function initialLoad() {
  const selectedDash = localStorage.getItem("QuickDashSelected");
  const quickDashConfig = localStorage.getItem("QuickDashConfig");
  const numberOfColumns = localStorage.getItem("NumberOfColumns");
  if (selectedDash) {
    store.commit("setSelectedDash", Number(selectedDash));
  }
  if (quickDashConfig) {
    store.commit("setQuickDashConfig", convertJSONtoClasses(quickDashConfig, false));
  }
  if (numberOfColumns) {
    store.commit("setNumberOfColumns", Number(numberOfColumns));
  }
}*/
