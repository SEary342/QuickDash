<template>
  <b-tabs content-class="mt-3" pills variant="secondary">
    <b-tab
      :title="dash.name"
      v-for="dash in displayDashboards"
      v-bind:active="dash.name === $store.getters.selectedDash"
      :key="dash.name"
    >
      <b-container fluid class="w-75">
        <b-row>
          <b-col v-for="(col, colIndex) in dash.groupList" :key="colIndex">
            <b-row
              v-for="(grp, grpIndex) in col"
              :key="''.concat(colIndex, '-', grpIndex)"
              ><b-col>
                <b-card :title="grp.name" class="mb-4">
                  <b-button
                    v-for="(link, btnIndex) in grp.linkList"
                    :key="''.concat(colIndex, '-', grpIndex, '-', btnIndex)"
                    :href="link.url"
                    target="_blank"
                    :variant="link.color"
                    size="lg"
                    block
                    >{{ link.text }}</b-button
                  >
                  <b-button
                    variant="outline-secondary"
                    block
                    @click="createLink(dash.name, grp)"
                    ><BIconPlus font-scale="2"/></b-button></b-card
              ></b-col>
            </b-row>
          </b-col>
        </b-row>
      </b-container>
    </b-tab>

    <template #tabs-end>
      <b-nav-item role="presentation" v-b-modal.new-tab href="#"
        ><BIconPlus
      /></b-nav-item>
    </template>

    <template #empty>
      <div class="text-center text-muted">
        There are no open tabs<br />
        Open a new tab using the <b>+</b> button above.
      </div>
    </template>
    <b-modal
      id="new-tab"
      @hidden="newTabName = null"
      title="New Dashboard"
      @ok="$store.commit('addEmptyDash', newTabName)"
    >
      <b-form-group label="Dashboard Name:"
        ><b-form-input v-model="newTabName"></b-form-input
      ></b-form-group>
    </b-modal>
    <b-modal
      id="new-link"
      @hidden="resetLinkModal"
      title="New Link"
      @ok="saveLink"
      :ok-disabled="
        newLinkData.name === null ||
          newLinkData.name.length === 0 ||
          newLinkData.URL === null ||
          newLinkData.URL.length === null ||
          linkNameValid !== true
      "
    >
      <b-form-group label="Link Name:"
        ><b-form-input
          v-model="newLinkData.name"
          :state="linkNameValid"
        ></b-form-input
      ></b-form-group>
      <b-form-group label="Link URL:"
        ><b-form-input v-model="newLinkData.URL"></b-form-input
      ></b-form-group>
    </b-modal>
  </b-tabs>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { LinkGroup } from "../ConfigStructure";

type DisplayDash = {
  name: string;
  groupList: LinkGroup[][];
};

type NewLink = {
  name: string | null;
  URL: string | null;
  dashName: string | null;
  dashGroup: LinkGroup | null;
};

@Component
export default class LinkPanel extends Vue {
  newTabName = null;
  newLinkData: NewLink = {
    name: null,
    URL: null,
    dashName: null,
    dashGroup: null
  };

  createLink(dashName: string, dashGroup: LinkGroup) {
    this.newLinkData.dashName = dashName;
    this.newLinkData.dashGroup = dashGroup;
    this.$bvModal.show("new-link");
  }

  get linkNameValid() {
    if (
      this.newLinkData.name === null ||
      this.newLinkData.dashGroup === null
    ) {
      return null;
    }
    return !this.newLinkData.dashGroup.linkList
      .map(x => x.text.toLowerCase())
      .includes(String(this.newLinkData.name).toLowerCase());
  }

  saveLink() {
    // TODO implement this on the store end
    // Make the new tabs save
    // Make it possible to add new groups
    // Implement import & export
    // Add the ability to edit group data
    console.log(this.newLinkData);
  }

  resetLinkModal() {
    this.newLinkData = {
      name: null,
      URL: null,
      dashName: null,
      dashGroup: null
    };
  }

  get displayDashboards() {
    const displayConfig = [];
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
