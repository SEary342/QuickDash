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
        }}<b-button
          v-b-tooltip.hover
          title="Edit Dash"
          variant="light"
          size="sm"
          class="ml-2 whiteButton"
          @click="editDash(dash.name)"
        >
          <BIconPencil />
        </b-button>
      </template>
      <b-container fluid class="w-75">
        <b-row>
          <b-col v-for="(col, colIndex) in dash.groupList" :key="colIndex">
            <b-row
              v-for="(grp, grpIndex) in col"
              :key="`${colIndex}-${grpIndex}`"
            >
              <b-col>
                <LinkCard :dash="dash" :grp="grp" :grp-names="groupNames" />
              </b-col>
            </b-row>
          </b-col>
        </b-row>
      </b-container>
    </b-tab>

    <template #tabs-end>
      <b-button
        v-b-tooltip.hover
        variant="light"
        class="whiteButton py-1 border-bottom-0"
        title="Add Dash"
        @click.prevent="addDash"
      >
        <BIconPlus font-scale="2" />
      </b-button>
    </template>

    <template #empty>
      <b-jumbotron header="Welcome to QuickDash!">
        <p>There are no Dashboards loaded.</p>
        <p>
          Create a new Dash using the <b>+</b> button above or import an
          existing QuickDash configuration.
        </p>
        <hr />
        <p>
          Don't forget to export your QuickDash configuration using the
          <BIconGearFill /> menu just in case your browswer misplaces it!
        </p>
        <b-button variant="primary" @click="showFullImport">
          Import Configuration
        </b-button>
      </b-jumbotron>
    </template>

    <b-modal
      id="dash-modal"
      :title="editDashInd ? 'Edit Dash' : 'New Dash'"
      @hidden="resetDashModal"
    >
      <b-form-group
        label="Dash Name:"
        invalid-feedback="Dash names must be unique"
      >
        <b-form-input
          v-model="dashName"
          :state="dashValid"
          placeholder="Enter a name for the dash"
        />
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
        <b-row class="w-100">
          <b-col cols="6">
            <b-button v-if="editDashInd" @click="exportDash">
              Export Dash </b-button
            ><b-button v-if="!editDashInd" @click="importInd = true">
              Import Dash
            </b-button>
          </b-col>
          <b-col cols="6" class="text-right">
            <b-button
              v-if="editDashInd"
              class="mr-2"
              variant="danger"
              @click="deleteDash"
            >
              Delete </b-button
            ><b-button
              class="ml-2"
              variant="success"
              :disabled="
                dashValid !== true || (importInd && uploadFile === null)
              "
              @click="saveDash"
            >
              Save
            </b-button>
          </b-col>
        </b-row>
      </template>
    </b-modal>
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

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { LinkGroup, LinkPage } from "../ConfigStructure";
import LinkCard from "./LinkCard.vue";
import { exportConfig, readFile } from "../utility";
import App from "../App.vue";

export type DisplayDash = {
  name: string;
  groupList: LinkGroup[][];
};

@Component({
  components: {
    LinkCard
  }
})
export default class LinkPanel extends Vue {
  dashName: string | null = null;
  initialDashName: string | null = null;
  editDashInd = false;
  importInd = false;
  uploadFile: File | null = null;
  dashExportExt = ".QDdashConfig";

  addDash() {
    this.$bvModal.show("dash-modal");
  }

  fileAdded() {
    if (
      (this.dashName === null || this.dashName.length === 0) &&
      this.uploadFile !== null
    ) {
      this.dashName = this.uploadFile.name.split(".")[0];
    }
  }

  showFullImport() {
    const parentComp = this.$parent as App;
    parentComp.showUpload();
  }

  editDash(editDash: string) {
    this.editDashInd = true;
    this.dashName = editDash;
    this.initialDashName = editDash;
    this.$bvModal.show("dash-modal");
  }

  async saveDash() {
    this.$store.commit("addEditDash", {
      name: this.initialDashName,
      newDashName: this.dashName
    });
    if (this.importInd) {
      const importData = await readFile(this.uploadFile as File);
      this.$store.commit("bulkAddGroups", {
        groupList: importData,
        name: this.dashName
      });
    }
    this.$bvModal.hide("dash-modal");
  }

  deleteDash() {
    this.$bvModal
      .msgBoxConfirm(
        `Are you sure that you want to delete '${this.initialDashName}'`,
        {
          title: "Confirm Dash Deletion",
          okVariant: "danger",
          okTitle: "Delete"
        }
      )
      .then((value) => {
        if (value) {
          this.$store.commit("deleteDash", this.initialDashName);
          this.$bvModal.hide("dash-modal");
        }
      });
  }

  exportDash() {
    const exportDashData = this.currentConfig.find(
      (x) => x.name === this.initialDashName
    );
    if (exportDashData) {
      exportConfig(
        this.initialDashName as string,
        this.dashExportExt,
        exportDashData.groupList
      );
    } else {
      this.$bvToast.toast("Unable to find dash to export!", {
        title: "Export Error",
        solid: true,
        variant: "danger"
      });
    }
    this.$bvModal.hide("dash-modal");
  }

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

  get groupNames() {
    return this.$store.getters.groupNames;
  }

  get dashValid() {
    if (
      this.dashName === null ||
      this.dashName === "" ||
      this.dashName === this.initialDashName
    ) {
      return null;
    } else {
      return !this.dashNames.includes(String(this.dashName).toLowerCase());
    }
  }

  get dashNames() {
    const dashNames: string[] = this.$store.getters.dashNames;
    return dashNames.map((x) => x.toLowerCase());
  }

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

  get currentConfig(): LinkPage[] {
    return this.$store.getters.quickDashConfig;
  }
}
</script>
