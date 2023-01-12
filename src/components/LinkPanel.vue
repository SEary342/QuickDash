<script lang="ts">
import { LinkGroup, LinkPage } from "../configStructure";
export type DisplayDash = {
  name: string;
  groupList: LinkGroup[][];
};
</script>

<script setup lang="ts">
import { ref, computed } from "vue";

import LinkCard from "./LinkCard.vue";
import { exportConfig, readFile } from "../utility";
import { useAppStore } from "@/store/app";
import { storeToRefs } from "pinia";
import App from "../App.vue";

const appStore = useAppStore();
const { quickDashConfig, numberOfColumns, selectedDash, groupNames, dashNames } = storeToRefs(appStore);

const props = defineProps({ showUpload: { type: Function, default: () => undefined } });

const dashName = ref<string>();
const initialDashName = ref<string>();
const editDashInd = ref(false);
const importInd = ref(false);
const uploadFile = ref<File>();
const dashExportExt = ".QDdashConfig";
const dialog = ref(false);

function addDash() {
  dialog.value = true;
}

function fileAdded() {
  if ((dashName.value === undefined || dashName.value.length === 0) && uploadFile.value !== undefined) {
    dashName.value = uploadFile.value.name.split(".")[0];
  }
}

function editDash(editDash: string) {
  editDashInd.value = true;
  dashName.value = editDash;
  initialDashName.value = editDash;
  dialog.value = true;
}

const dashValid = computed(() => {
  if (dashName.value === undefined || dashName.value === "" || dashName.value === initialDashName.value) {
    return null;
  } else {
    return !dashNames.value.map((x) => x.toLowerCase()).includes(String(dashName.value).toLowerCase());
  }
});

async function saveDash() {
  if (dashName.value) {
    appStore.addEditDash({ name: initialDashName.value, newDashName: dashName.value });
    if (importInd.value && uploadFile.value) {
      const importData = await readFile(uploadFile.value);
      if (!("QuickDashConfig" in importData)) {
        appStore.bulkAddGroups(new LinkPage(dashName.value, importData));
      }
    }
    dialog.value = false;
  }

  function deleteDash() {
    if (initialDashName.value) {
      appStore.deleteDash(initialDashName.value);
    }
  }

  function exportDash() {
    const exportDashData = quickDashConfig.value.find((x) => x.name === initialDashName.value);
    if (exportDashData && initialDashName.value) {
      exportConfig(initialDashName.value, dashExportExt, exportDashData.groupList);
    }
    dialog.value = false;
  }
}

/*export default class LinkPanel extends Vue {

  

  resetDashModal() {
    this.dashName = null;
    this.initialDashName = null;
    this.editDashInd = false;
    this.importInd = false;
    this.uploadFile = null;
  }

  get selectedDash() {
    return this.$store.getters.selectedDash;
  }

  set selectedDash(selectedDash) {
    this.$store.commit("setSelectedDash", selectedDash);
  }

  get 

  get displayDashboards(): DisplayDash[] {
    const displayConfig: DisplayDash[] = [];
    for (const dash of this.currentConfig) {
      const displayItem: DisplayDash = { name: dash.name, groupList: [[]] };
      const colsArray: LinkGroup[][] = [];
      for (let i = 0; i < this.numberOfColumns; i++) {
        colsArray.push([]);
      }
      let currCol = 0;
      for (const grp of dash.groupList) {
        colsArray[currCol].push(grp);
        if (currCol < this.numberOfColumns - 1) {
          currCol++;
        } else {
          currCol = 0;
        }
      }
      colsArray[currCol].push(new LinkGroup(null));
      displayItem.groupList = colsArray;
      displayConfig.push(displayItem);
    }
    return displayConfig;
  }

  get numberOfColumns(): number {
    return this.$store.getters.numberOfColumns;
  }

}*/
</script>
<template>
  <b-tabs content-class="mt-3" variant="secondary" v-model="selectedDash">
    <b-tab
      v-for="(dash, idx) in displayDashboards"
      :key="dash.name"
      :ref="`dash${idx}`"
      title-link-class="text-secondary"
    >
      <template #title>
        {{ dash.name
        }}<v-btn v-b-tooltip.hover title="Edit Dash" size="sm" class="ml-2 whiteButton" @click="editDash(dash.name)">
          <BIconPencil />
        </v-btn>
      </template>
      <v-container fluid class="w-75">
        <v-row>
          <v-col v-for="(col, colIndex) in dash.groupList" :key="colIndex">
            <v-row v-for="(grp, grpIndex) in col" :key="`${colIndex}-${grpIndex}`">
              <v-col>
                <LinkCard :dash="dash" :grp="grp" :grp-names="groupNames" />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </b-tab>

    <template #tabs-end>
      <v-btn class="whiteButton py-1 border-bottom-0" title="Add Dash" @click.prevent="addDash">
        <BIconPlus font-scale="2" />
      </v-btn>
    </template>

    <template #empty>
      <b-jumbotron header="Welcome to QuickDash!">
        <p>There are no Dashboards loaded.</p>
        <p>Create a new Dash using the <b>+</b> button above or import an existing QuickDash configuration.</p>
        <hr />
        <p>
          Don't forget to export your QuickDash configuration using the
          <BIconGearFill /> menu just in case your browswer misplaces it!
        </p>
        <v-btn color="primary" @click="props.showUpload"> Import Configuration </v-btn>
      </b-jumbotron>
    </template>

    <v-dialog v-model="dialog" :title="editDashInd ? 'Edit Dash' : 'New Dash'" @hidden="resetDashModal">
      <b-form-group label="Dash Name:" invalid-feedback="Dash names must be unique">
        <b-form-input v-model="dashName" :state="dashValid" placeholder="Enter a name for the dash" />
      </b-form-group>
      <b-form-file
        v-if="importInd"
        v-model="uploadFile"
        :accept="dashExportExt"
        placeholder="Choose a file or drop it here..."
        drop-placeholder="Drop file here..."
        @input="fileAdded"
      />

      <template #modal-footer>
        <v-row class="w-100">
          <v-col cols="6">
            <v-btn v-if="editDashInd" @click="exportDash"> Export Dash </v-btn
            ><v-btn v-if="!editDashInd" @click="importInd = true"> Import Dash </v-btn>
          </v-col>
          <v-col cols="6" class="text-right">
            <v-btn v-if="editDashInd" class="mr-2" color="error">
              Delete
              <v-dialog activator="parent"
                ><v-card title="Confirmation"
                  ><v-card-text>Are you sure that you want to delete {{ initialDashName }}?</v-card-text
                  ><v-card-actions><v-btn @click="deleteDash">Delete</v-btn></v-card-actions></v-card
                ></v-dialog
              ></v-btn
            ><v-btn
              class="ml-2"
              color="success"
              :disabled="dashValid !== true || (importInd && uploadFile === null)"
              @click="saveDash"
            >
              Save
            </v-btn>
          </v-col>
        </v-row>
      </template>
    </v-dialog>
  </b-tabs>
</template>

<style>
.dropColor:active {
  background-color: var(--secondary) !important;
}

.whiteButton {
  background-color: var(--white) !important;
  border-color: var(--white) !important;
  color: var(--secondary) !important;
}
.whiteButton:hover {
  border-color: rgb(222, 226, 230) !important;
}
</style>
