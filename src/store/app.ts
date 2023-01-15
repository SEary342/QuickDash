// Utilities
import { ref, computed } from "vue";
import { defineStore } from "pinia";

import type { LinkPage } from "../configStructure";

const localStorage = window.localStorage;

export const useAppStore = defineStore(
  "app",
  () => {
    const selectedDash = ref<string>();
    const quickDashConfig = ref<LinkPage[]>([]);
    const numberOfColumns = ref(3);

    const groupNames = computed(() =>
      quickDashConfig.value
        .map((dash) =>
          dash.groupList.map((grp) => ({ dash: dash.name, grp: grp.name }))
        )
        .flat()
    );
    const dashNames = computed(() =>
      quickDashConfig.value.map((dash) => dash.name)
    );

    function addEditDash(dashConfig: { name?: string; newDashName: string }) {
      if (dashConfig.name === undefined) {
        quickDashConfig.value.push({
          name: dashConfig.newDashName,
          groupList: []
        });
      } else {
        const editDash = quickDashConfig.value.find(
          (x) => x.name === dashConfig.name
        );
        if (editDash !== undefined) {
          editDash.name = dashConfig.newDashName;
        } else {
          throw new Error(`Cannot find dash: '${dashConfig.name}'`);
        }
      }
    }

    function deleteDash(dashName: string) {
      const dashIndex = quickDashConfig.value.findIndex(
        (x) => x.name === dashName
      );
      if (dashIndex !== -1) {
        quickDashConfig.value.splice(dashIndex, 1);
      } else {
        throw new Error(`Cannot find dash: '${dashName}'`);
      }
    }

    return {
      addEditDash,
      selectedDash,
      quickDashConfig,
      numberOfColumns,
      dashNames,
      deleteDash,
      groupNames
    };
  },
  {
    persist: {
      storage: localStorage,
      paths: ["selectedDash", "quickDashConfig", "numberOfColumns"]
    }
  }
);
