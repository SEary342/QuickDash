<template>
  <b-tabs content-class="mt-3" pills variant="secondary">
    <b-tab
      :title="dash.name"
      v-for="dash in displayDashboards"
      v-bind:active="dash.name === $store.getters.selectedDash"
      :key="dash.name"
    >
      <b-container>
        <b-row
          v-for="(row, rowIndex) in dash.groupList"
          :key="rowIndex"
          class="mb-3"
        >
          <b-col
            v-for="(grp, colIndex) in row"
            :key="''.concat(rowIndex, '-', colIndex)"
          >
            <b-card :title="grp.name">
              <b-button
                v-for="(link, btnIndex) in grp.linkList"
                :key="''.concat(rowIndex, '-', colIndex, '-', btnIndex)"
                :href="link.url"
                target="_blank"
                :variant="link.color"
                size="lg"
                block
                >{{ link.text }}</b-button
              >
            </b-card>
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
  </b-tabs>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { LinkPage, LinkGroup } from "../ConfigStructure";
import { numberOfColumns } from "../LinkConfig";

type DisplayDash = {
  name: string;
  groupList: LinkGroup[][];
};

@Component
export default class LinkPanel extends Vue {
  newTabName = null;

  get displayDashboards() {
    const initConfig = this.currentConfig;
    const displayConfig = [];
    for (const dash of initConfig) {
      const displayItem: DisplayDash = { name: dash.name, groupList: [[]] };
      const rowsArray: LinkGroup[][] = [[]];
      let rowNum = 0;
      for (const item of dash.groupList) {
        if (rowsArray[rowNum].length > this.numberOfColumns - 1) {
          rowsArray.push([]);
          rowNum++;
        }
        rowsArray[rowNum].push(item);
      }
      displayItem.groupList = rowsArray;
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
