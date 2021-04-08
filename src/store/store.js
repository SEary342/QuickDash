import Vue from "vue";
import Vuex from "vuex";
import { LinkGroup, LinkPage, LinkData } from "../ConfigStructure";

Vue.use(Vuex);
const localStorage = window.localStorage;

function getEditDash(dashName, dashConfig) {
  return dashConfig.find((x) => x.name === dashName);
}

function getEditGrp(dashName, grpName, dashConfig) {
  return getEditDash(dashName, dashConfig).groupList.find(
    (x) => x.name === grpName
  );
}

function updateDashSelected(selectedDash) {
  localStorage.setItem("QuickDashSelected", selectedDash);
}

function updateDashConfig(dashConfig) {
  localStorage.setItem("QuickDashConfig", JSON.stringify(dashConfig));
}

function updateNumberOfColumns(numColumns) {
  localStorage.setItem("NumberOfColumns", numColumns);
}

function convertJSONtoGrpClasses(groupList) {
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

function convertJSONtoClasses(inputData, jsonMode) {
  if (!jsonMode) {
    inputData = JSON.parse(inputData);
  }
  const conversionArray = [];
  for (const dash of inputData) {
    const newDash = new LinkPage(
      dash.name,
      convertJSONtoGrpClasses(dash.groupList)
    );
    conversionArray.push(newDash);
  }
  return conversionArray;
}

export const store = new Vuex.Store({
  state: {
    selectedDash: 0,
    quickDashConfig: [],
    numberOfColumns: 3
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
      if (
        importKeys.includes("QuickDashConfig") &&
        Array.isArray(importConfigData.QuickDashConfig)
      ) {
        state.quickDashConfig = convertJSONtoClasses(
          importConfigData.QuickDashConfig,
          true
        );
        updateDashConfig(state.quickDashConfig);
        if (
          importKeys.includes("NumberOfColumns") &&
          Number.isInteger(importConfigData.NumberOfColumns)
        ) {
          state.numberOfColumns = importConfigData.NumberOfColumns;
          updateNumberOfColumns(state.numberOfColumns);
        }
        if (
          importKeys.includes("QuickDashSelected") &&
          Number.isInteger(importConfigData.QuickDashSelected)
        ) {
          state.selectedDash = importConfigData.QuickDashSelected;
          updateDashSelected(state.selectedDash);
        }
      }
    },
    addEditDash(state, dashConfig) {
      if (dashConfig.name === null) {
        state.quickDashConfig.push(new LinkPage(dashConfig.newDashName));
      } else {
        const editDash = state.quickDashConfig.find(
          (x) => x.name === dashConfig.name
        );
        if (editDash !== undefined) {
          editDash.name = dashConfig.newDashName;
        } else {
          throw new Error(`Cannot find dash: '${dashConfig.name}'`);
        }
      }
      updateDashConfig(state.quickDashConfig);
    },
    deleteDash(state, dashName) {
      const dashIndex = state.quickDashConfig.findIndex(
        (x) => x.name === dashName
      );
      if (dashIndex !== -1) {
        state.quickDashConfig.splice(dashIndex, 1);
      } else {
        throw new Error(`Cannot find dash: '${dashName}'`);
      }
      updateDashConfig(state.quickDashConfig);
    },
    setNumberOfColumns(state, numberOfColumns) {
      state.numberOfColumns = numberOfColumns;
      updateNumberOfColumns(state.numberOfColumns);
    },
    reorderGroup(state, reorderConfig) {
      const editGrp = getEditGrp(
        reorderConfig.dashName,
        reorderConfig.name,
        state.quickDashConfig
      );
      editGrp.linkList = [...reorderConfig.linkList];
      updateDashConfig(state.quickDashConfig);
    },
    addEditLink(state, linkConfig) {
      const editGrp = getEditGrp(
        linkConfig.dashName,
        linkConfig.dashGroup.name,
        state.quickDashConfig
      );
      if (linkConfig.initialName === null) {
        editGrp.addLink(linkConfig.name, linkConfig.url, linkConfig.color);
      } else {
        editGrp.editLink(
          linkConfig.initialName,
          linkConfig.name,
          linkConfig.url,
          linkConfig.color
        );
      }
      updateDashConfig(state.quickDashConfig);
    },
    deleteLink(state, linkConfig) {
      const editGrp = getEditGrp(
        linkConfig.dashName,
        linkConfig.dashGroup.name,
        state.quickDashConfig
      );
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
    bulkAddGroups(state, importGrpConfig) {
      const editDash = getEditDash(
        importGrpConfig.name,
        state.quickDashConfig
      );
      if (Array.isArray(importGrpConfig.groupList)) {
        const convGrps = convertJSONtoGrpClasses(importGrpConfig.groupList);
        for (const grp of convGrps) {
          editDash.addGroup(grp.name, grp.linkList);
        }
      } else {
        throw new Error("Invalid input data");
      }
      updateDashConfig(state.quickDashConfig);
    },
    deleteGroup(state, grpConfig) {
      const editDash = getEditDash(grpConfig.dash, state.quickDashConfig);
      editDash.deleteGroup(grpConfig.name);
      updateDashConfig(state.quickDashConfig);
    }
  },
  getters: {
    selectedDash: (state) => state.selectedDash,
    quickDashConfig: (state) => state.quickDashConfig,
    numberOfColumns: (state) => state.numberOfColumns,
    groupNames: (state) =>
      state.quickDashConfig
        .map((dash) =>
          dash.groupList.map((grp) => {
            return { dash: dash.name, grp: grp.name };
          })
        )
        .flat(),
    dashNames: (state) => state.quickDashConfig.map((dash) => dash.name),
    exportData: (state) => {
      return {
        QuickDashConfig: state.quickDashConfig,
        NumberOfColumns: state.numberOfColumns,
        QuickDashSelected: state.selectedDash
      };
    }
  }
});

export function initialLoad() {
  const selectedDash = localStorage.getItem("QuickDashSelected");
  const quickDashConfig = localStorage.getItem("QuickDashConfig");
  const numberOfColumns = localStorage.getItem("NumberOfColumns");
  if (selectedDash) {
    store.commit("setSelectedDash", Number(selectedDash));
  }
  if (quickDashConfig) {
    store.commit(
      "setQuickDashConfig",
      convertJSONtoClasses(quickDashConfig, false)
    );
  }
  if (numberOfColumns) {
    store.commit("setNumberOfColumns", Number(numberOfColumns));
  }
}
