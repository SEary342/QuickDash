<script setup lang="ts">
import type { LinkGroup } from "@/configStructure";
import { ref, computed } from "vue";
import AddItem from "./AddItem.vue";
import LinkCard from "./LinkCard.vue";
import { storeToRefs } from "pinia";
import { useAppStore } from "@/store/app";

const appStore = useAppStore();
const { numberOfColumns, selectedDash, quickDashConfig } =
  storeToRefs(appStore);

const tab = computed({
  get: () =>
    selectedDash.value == undefined
      ? renderTabs.value[0]
      : selectedDash.value,
  set: (value) => (selectedDash.value = value)
});

const renderTabs = computed(() => quickDashConfig.value.map((x) => x.name));

function addDash(name: string) {
  quickDashConfig.value.push({ name: name, groupList: [] });
  selectedDash.value = name;
}

function updateDash(name: string, oldName: string) {
  const dashData = quickDashConfig.value.find((x) => x.name == oldName);
  if (dashData) {
    dashData.name = name;
  }
}

function deleteDash(name: string) {
  const idx = quickDashConfig.value.findIndex((x) => x.name == name);

  if (idx != -1) {
    if (selectedDash.value == name) {
      let newSelIdx = idx - 1;
      if (newSelIdx < 0) {
        newSelIdx = 1;
      }
      selectedDash.value = renderTabs.value[newSelIdx];
    }
    quickDashConfig.value.splice(idx, 1);
  }
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

const groupNames = computed(() => pageData.value.map((x) => x.name));

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
        ><AddItem
          :current-name="t"
          type-name="Dash"
          @update:name="(v) => updateDash(v, t)"
          @delete:name="() => deleteDash(t)"
          :existing-items="renderTabs.filter((x) => x != t)" /></v-btn></v-tab
    ><v-btn size="large" variant="text"
      ><v-icon icon="mdi-plus"></v-icon
      ><AddItem
        @update:name="addDash"
        type-name="Dash"
        :existing-items="renderTabs" /></v-btn
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
          :dash-group-names="groupNames"
        />
      </v-col>
      <v-col v-if="idx == displayPage.length - 1"
        ><LinkCard
          name="Add Group"
          :link-list="[]"
          :add-mode="true"
          :dash-group-names="groupNames"
      /></v-col> </v-row
  ></v-container>
</template>
