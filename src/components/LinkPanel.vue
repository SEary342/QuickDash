<template>
  <b-tabs content-class="mt-3" variant="secondary" v-model="selectedDash">
    <b-tab
      v-for="dash in displayDashboards"
      title-link-class="text-secondary"
      :key="dash.name"
    >
      <template #title>
        {{ dash.name
        }}<b-button
          v-b-tooltip.hover
          title="Edit Dash"
          @click="editDash(dash.name)"
          variant="light"
          size="sm"
          class="ml-2 whiteButton"
          ><BIconPencil
        /></b-button>
      </template>
      <b-container fluid class="w-75">
        <b-row>
          <b-col v-for="(col, colIndex) in dash.groupList" :key="colIndex">
            <b-row
              v-for="(grp, grpIndex) in col"
              :key="`${colIndex}-${grpIndex}`"
              ><b-col
                ><LinkCard :dash="dash" :grp="grp" :grpNames="groupNames"
              /></b-col>
            </b-row>
          </b-col>
        </b-row>
      </b-container>
    </b-tab>

    <template #tabs-end>
      <b-button
        @click.prevent="addDash"
        variant="light"
        class="whiteButton py-1 border-bottom-0"
        v-b-tooltip.hover
        title="Add Dash"
        ><BIconPlus font-scale="2"
      /></b-button>
    </template>

    <template #empty>
      <div class="text-center text-muted">
        There are no open tabs<br />
        Open a new tab using the <b>+</b> button above.
      </div>
    </template>

    <b-modal
      id="dash-modal"
      @hidden="resetDashModal"
      :title="editDashInd ? 'Edit Dash' : 'New Dash'"
      @ok="saveDash"
      @cancel="deleteDash"
      :ok-disabled="dashValid !== true"
      cancel-title="Delete"
      ok-title="Save"
      ok-variant="success"
      cancel-variant="danger"
      :ok-only="!editDashInd"
    >
      <b-form-group label="Dash Name:"
        ><b-form-input v-model="dashName" :state="dashValid"></b-form-input
      ></b-form-group>
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
import { LinkGroup } from "../ConfigStructure";
import LinkCard from "./LinkCard.vue";

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

  addDash() {
    this.$bvModal.show("dash-modal");
  }

  editDash(editDash: string) {
    this.editDashInd = true;
    this.dashName = editDash;
    this.initialDashName = editDash;
    this.$bvModal.show("dash-modal");
  }

  saveDash() {
    if (this.editDashInd) {
      // TODO implemnt dash edit
      console.log("hi");
    } else {
      this.$store.commit("addEmptyDash", this.dashName);
    }
  }

  deleteDash() {
    const deleteDashName = String(this.initialDashName).slice();
    this.$bvModal
      .msgBoxConfirm(
        `Are you sure that you want to delete '${deleteDashName}'`,
        {
          title: "Confirm Dash Deletion",
          okVariant: "danger",
          okTitle: "Delete"
        }
      )
      .then(value => {
        if (value) {
          // TODO implement dash deletion in store
          console.log(deleteDashName);
        }
      });
  }

  resetDashModal() {
    this.dashName = null;
    this.initialDashName = null;
    this.editDashInd = false;
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
    return dashNames.map(x => x.toLowerCase());
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

  get numberOfColumns() {
    return this.$store.getters.numberOfColumns;
  }

  get currentConfig() {
    return this.$store.getters.quickDashConfig;
  }
}
</script>
