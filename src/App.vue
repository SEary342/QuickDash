<script setup lang="ts">
import QdLogo from "./assets/qdLogo.svg?component";
import UploadDialog from "./components/UploadDialog.vue";
import { exportConfig } from "./utility";
import LinkPanel from "./components/LinkPanel.vue";
import { storeToRefs } from "pinia";
import { useAppStore } from "@/store/app";

const appStore = useAppStore();
const {numberOfColumns} =storeToRefs(appStore)

// TODO Link Dialog
// TODO import/export functions
// Make load compatible with the old 1.0.x versions
function exportFullConfig() {
  exportConfig("QuickDashConfig", ".QDconfig", []);
}
</script>

<template>
  <v-app>
    <v-app-bar color="blue-grey-darken-2"
      ><QdLogo class="ml-3" /><v-app-bar-title
        class="ml-2 text-h5 font-weight-bold"
        >QuickDash</v-app-bar-title
      ><v-menu :close-on-content-click="false"
        ><template v-slot:activator="{ props }">
          <v-btn variant="text" v-bind="props" class="px-0" rounded="pill"
            ><v-icon icon="mdi-cog" size="large" /><v-icon
              icon="mdi-chevron-down"
          /></v-btn> </template
        ><v-list>
          <v-list-item
            title="Import"
            value="Import"
            prepend-icon="mdi-import"
          >
            <UploadDialog />
          </v-list-item>
          <v-list-item
            title="Export"
            value="Export"
            prepend-icon="mdi-export"
            @click="exportFullConfig"
          >
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item class="mb-3" prepend-icon="mdi-table-column">
            <v-list-item-title class="my-3">Columns</v-list-item-title>
            <div class="d-flex align-center">
              <v-btn
                :disabled="numberOfColumns == 1"
                @click="numberOfColumns = numberOfColumns - 1"
                density="compact"
                class="px-0 small-btn"
                variant="outlined"
                ><v-icon icon="mdi-minus"
              /></v-btn>
              <div class="px-3">{{ numberOfColumns }}</div>
              <v-btn
                :disabled="numberOfColumns == 6"
                @click="numberOfColumns = numberOfColumns + 1"
                density="compact"
                class="px-0 small-btn"
                variant="outlined"
                ><v-icon icon="mdi-plus"
              /></v-btn>
            </div>
          </v-list-item>
        </v-list> </v-menu
    ></v-app-bar>
    <v-main><LinkPanel /></v-main>
  </v-app>
</template>
<style scoped>
.small-btn {
  min-width: 30px;
}
</style>
