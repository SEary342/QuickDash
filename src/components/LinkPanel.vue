<template>
  <b-tabs content-class="mt-3" variant="secondary" v-model="selectedDash">
    <b-tab
      :title="dash.name"
      v-for="dash in displayDashboards"
      title-link-class="text-secondary"
      :key="dash.name"
    >
      <b-container fluid class="w-75">
        <b-row>
          <b-col v-for="(col, colIndex) in dash.groupList" :key="colIndex">
            <b-row
              v-for="(grp, grpIndex) in col"
              :key="''.concat(colIndex, '-', grpIndex)"
              ><b-col
                ><LinkCard :dash="dash" :grp="grp" :grpNames="groupNames"
              /></b-col>
            </b-row>
          </b-col>
        </b-row>
      </b-container>
    </b-tab>

    <template #tabs-end>
      <b-nav-item-dropdown toggle-class="text-secondary">
        <template #button-content><BIconList /> </template>
        <b-dropdown-item link-class="dropColor" @click="addDash"
          ><BIconPlus class="mr-2 text-success" />New Dash</b-dropdown-item
        >
        <b-dropdown-item link-class="dropColor" @click="editDash"
          ><BIconPencil class="mr-2" />Edit Dash Name</b-dropdown-item
        >
        <b-dropdown-item link-class="dropColor" @click="deleteDash"
          ><BIconTrash class="mr-2 text-danger" />Delete Dash</b-dropdown-item
        >
      </b-nav-item-dropdown>
    </template>

    <template #empty>
      <div class="text-center text-muted">
        There are no open tabs<br />
        Open a new tab using the <b>+</b> button above.
      </div>
    </template>
    <b-modal
      id="dash-modal"
      @hidden="editDashInd"
      :title="editDashInd ? 'Edit Dash Name' : 'New Dash Name'"
      @ok="saveDash"
      :ok-disabled="dashValid !== true"
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
  editDashInd = false;

  addDash() {
    this.$bvModal.show("dash-modal");
  }

  editDash() {
    this.editDashInd = true;
    this.dashName = this.displayDashboards[this.selectedDash].name;
    this.$bvModal.show("dash-modal");
  }

  saveDash() {
    if (this.editDashInd) {
      console.log("hi");
    } else {
      this.$store.commit("addEmptyDash", this.dashName);
    }
  }

  deleteDash() {
    this.$bvModal
      .msgBoxConfirm(
        "".concat(
          "Are you sure that you want to delete '",
          this.displayDashboards[this.selectedDash].name,
          "'"
        ),
        {
          title: "Confirm Dash Deletion",
          okVariant: "danger",
          okTitle: "Delete"
        }
      )
      .then(value => {
        if (value) {
          // TODO implement dash deletion in store
          console.log(this.displayDashboards[this.selectedDash].name);
        }
      });
  }

  resetDashModal() {
    this.dashName = null;
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
      this.dashName === this.displayDashboards[this.selectedDash].name
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
