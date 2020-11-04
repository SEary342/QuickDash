import Vue from "vue";
import Vuex from "vuex";
import { QuickDashConfig } from "../LinkConfig";
import { LinkPage } from "../ConfigStructure";

Vue.use(Vuex);

const localStorage = window.localStorage;

export const store = new Vuex.Store({
  state: {
    selectedDash: null,
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
    }
  },
  getters: {
    selectedDash: state => state.selectedDash,
    quickDashConfig: state => state.quickDashConfig,
    numberOfColumns: state => state.numberOfColumns
  }
});

export function initialLoad() {
  const selectedDash = localStorage.getItem("QuickDashSelected");
  const quickDashConfig = localStorage.getItem("QuickDashConfig");
  //store.commit("setSelectedDash", "Programming 2");
  store.commit("setQuickDashConfig", QuickDashConfig);
}
