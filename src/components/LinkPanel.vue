<template>
  <b-container>
    <b-row
      v-for="(row, rowIndex) in displayArray"
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
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { LinkGroup } from "../ConfigStructure";
import { LinkGroups, numberOfColumns } from "../LinkConfig";

@Component
export default class LinkPanel extends Vue {
  get displayArray() {
    const rowsArray: LinkGroup[][] = [[]];
    let rowNum = 0;
    for (const item of LinkGroups) {
      if (rowsArray[rowNum].length > numberOfColumns - 1) {
        rowsArray.push([]);
        rowNum++;
      }
      rowsArray[rowNum].push(item);
    }

    return rowsArray;
  }
}
</script>
