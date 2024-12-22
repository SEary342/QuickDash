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

    return {
      selectedDash,
      quickDashConfig,
      numberOfColumns,
    };
  },
  {
    persist: {
      storage: localStorage,
      pick: ["selectedDash", "quickDashConfig", "numberOfColumns"]
    }
  }
);
