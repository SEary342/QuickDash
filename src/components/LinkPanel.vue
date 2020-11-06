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
              ><b-col><LinkCard :dash="dash" :grp="grp"/></b-col>
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
  </b-tabs>
</template>

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
  newTabName = null;

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
