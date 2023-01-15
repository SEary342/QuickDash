<script setup lang="ts">
import type { LinkGroup } from "@/configStructure";
import { ref, computed } from "vue";
import AddDash from "./AddDash.vue";
import LinkCard from "./LinkCard.vue";
import { storeToRefs } from "pinia";
import { useAppStore } from "@/store/app";

const appStore = useAppStore();
const { numberOfColumns, selectedDash } = storeToRefs(appStore);

const tab = computed({
  get: () =>
    selectedDash.value == undefined
      ? renderTabs.value[0]
      : selectedDash.value,
  set: (value) => (selectedDash.value = value)
});

const renderTabs = computed(() => {
  // TODO get the tabs from the store
  return ["p1", "p2"];
});

function addDash(name: string) {
  // TODO integrate with the store
}

function updateDash(name: string, oldName: string) {
  // TODO integrate with the store
}

const devGrp: LinkGroup = {
  name: "Test Group",
  linkList: [
    {
      text: "test link1",
      url: "https://www.google.com",
      color: "success",
      outline: false
    },
    {
      text: "test link12",
      url: "https://www.google.com",
      color: "error",
      outline: true
    }
  ]
};

const devGrp2: LinkGroup = {
  name: "Test Group22",
  linkList: [
    {
      text: "test link1",
      url: "https://www.google.com",
      color: "warning",
      outline: true,
      icon: "mdi-death-star"
    },
    {
      text: "test link12",
      url: "https://www.google.com",
      color: "error",
      outline: true
    }
  ]
};

const pageData = computed(() => {
  // TODO replace with store
  if (selectedDash.value == "p1") {
    return [
      devGrp,
      devGrp,
      devGrp,
      devGrp2,
      devGrp2,
      devGrp2,
      devGrp2,
      devGrp2
    ];
  } else {
    return [devGrp2, devGrp];
  }
});

const displayPage = computed(() => {
  return pageData.value.reduce((resultArray: LinkGroup[][], item, index) => {
    const chunkIndex = Math.floor(index / numberOfColumns.value);
    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = []; // start a new chunk
    }
    resultArray[chunkIndex].push(item);
    return resultArray;
  }, []);
});
</script>
<template>
  <v-tabs v-model="tab"
    ><v-tab v-for="t in renderTabs" :key="t" :value="t"
      >{{ t
      }}<v-btn size="35" variant="text" class="ml-3" rounded="pill"
        ><v-icon icon="mdi-pencil"></v-icon
        ><AddDash
          :current-name="t"
          @update:name="(v) => updateDash(v, t)" /></v-btn></v-tab
    ><v-btn size="large" variant="text"
      ><v-icon icon="mdi-plus"></v-icon
      ><AddDash @update:name="addDash" /></v-btn
  ></v-tabs>
  <v-container
    ><v-row v-for="(row, idx) in displayPage" :key="`row-${idx}`">
      <v-col
        v-for="(col, idc) in row"
        :key="`col-${idx}-${idc}`"
        :cols="Math.floor(12 / numberOfColumns)"
        ><LinkCard
          :name="col.name"
          :link-list="col.linkList"
          :move-left="idx + idc != 0"
          :move-right="
            !(
              idx == displayPage.length - 1 &&
              idc == displayPage[displayPage.length - 1].length - 1
            )
          "
        /> </v-col></v-row
  ></v-container>
</template>
