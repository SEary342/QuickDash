import Vue from "vue";
import Vuex from "vuex";
import { QuickDashConfig } from "../LinkConfig";
import { LinkPage } from "../ConfigStructure";

Vue.use(Vuex);
// TODO connect store to local storage
// const localStorage = window.localStorage;

function getEditDash(dashName, dashConfig) {
  return dashConfig.find(x => x.name === dashName);
}

function getEditGrp(dashName, grpName, dashConfig) {
  return getEditDash(dashName, dashConfig).groupList.find(
    x => x.name === grpName
  );
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
    },
    setQuickDashConfig(state, quickDashConfig) {
      state.quickDashConfig = quickDashConfig;
      if (state.selectedDash === null) {
        state.selectedDash = quickDashConfig[0].name;
      }
    },
    addEmptyDash(state, newDashName) {
      state.quickDashConfig.push(new LinkPage(newDashName));
    },
    setNumberOfColumns(state, numberOfColumns) {
      state.numberOfColumns = numberOfColumns;
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
        editGrp.editLink(linkConfig.name, linkConfig.url, linkConfig.color);
      }
    },
    deleteLink(state, linkConfig) {
      const editGrp = getEditGrp(
        linkConfig.dashName,
        linkConfig.dashGroup.name,
        state.quickDashConfig
      );
      editGrp.deleteLink(linkConfig.name);
    },
    addEditGroup(state, grpConfig) {
      const editDash = getEditDash(grpConfig.dash, state.quickDashConfig);
      if (grpConfig.name !== null) {
        editDash.editGroup(grpConfig.name, grpConfig.newName);
      } else {
        editDash.addGroup(grpConfig.newName);
      }
    },
    deleteGroup(state, grpConfig) {
      const editDash = getEditDash(grpConfig.dash, state.quickDashConfig);
      editDash.deleteGroup(grpConfig.name);
    }
  },
  getters: {
    selectedDash: state => state.selectedDash,
    quickDashConfig: state => state.quickDashConfig,
    numberOfColumns: state => state.numberOfColumns,
    groupNames: state =>
      state.quickDashConfig
        .map(dash =>
          dash.groupList.map(grp => {
            return { dash: dash.name, grp: grp.name };
          })
        )
        .flat(),
    dashNames: state => state.quickDashConfig.map(dash => dash.name)
  }
});

export function initialLoad() {
  // const selectedDash = localStorage.getItem("QuickDashSelected");
  // const quickDashConfig = localStorage.getItem("QuickDashConfig");
  // const numberOfColumns = localStorage.getItem("NumberOfColumns");
  // store.commit("setSelectedDash", 0);
  store.commit("setQuickDashConfig", QuickDashConfig);
}
