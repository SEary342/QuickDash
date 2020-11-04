<template>
  <b-tabs content-class="mt-3" pills>
    <b-tab
      :title="dash.name"
      v-for="dash in $store.getters.quickDashConfig"
      v-bind:active="dash.name === $store.getters.selectedDash"
      :key="dash.name"
    >
      <b-container>
        <b-row
          v-for="(row, rowIndex) in displayArray(dash.groupList)"
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
      <b-nav-item role="presentation" @click.prevent="newTab" href="#"
        ><BIconPlus
      /></b-nav-item>
    </template>

    <template #empty>
      <div class="text-center text-muted">
        There are no open tabs<br />
        Open a new tab using the <b>+</b> button above.
      </div>
    </template>
  </b-tabs>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { LinkPage, LinkGroup } from "../ConfigStructure";
import { BIconPlus } from "bootstrap-vue";

Vue.component('BIconPlus', BIconPlus)

@Component
export default class LinkPanel extends Vue {

  displayArray(inputGroups: LinkGroup[]) {
    const rowsArray: LinkGroup[][] = [[]];
    let rowNum = 0;
    for (const item of inputGroups) {
      if (
        rowsArray[rowNum].length >
        this.$store.getters.numberOfColumns - 1
      ) {
        rowsArray.push([]);
        rowNum++;
      }
      rowsArray[rowNum].push(item);
    }

    return rowsArray;
  }

  newTab() {
    this.$store.commit("addEmptyDash", "test")
  }
}
</script>
