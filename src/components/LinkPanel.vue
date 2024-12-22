<script setup lang="ts">
import type { LinkGroup } from "@/configStructure";
import { ref, computed, nextTick } from "vue";
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
      ? renderTabs.value[0]?.name
      : selectedDash.value,
  set: (value) => (selectedDash.value = value)
});

const colCt = computed(() => Math.floor(12 / numberOfColumns.value));

const renderTabs = computed(() =>
  quickDashConfig.value.map((x) => ({
    name: x.name,
    color: x.color,
    icon: x.icon
  }))
);

function addDash(item: { name: string; icon?: string; color?: string }) {
  quickDashConfig.value.push({
    name: item.name,
    groupList: [],
    icon: item.icon,
    color: item.color
  });
  selectedDash.value = item.name;
}

function updateDash(
  item: { name: string; icon?: string; color?: string },
  oldName: string
) {
  const dashData = quickDashConfig.value.find((x) => x.name == oldName);
  if (dashData) {
    dashData.name = item.name;
    dashData.icon = item.icon;
    dashData.color = item.color;
    nextTick(() => (selectedDash.value = item.name));
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
      if (newSelIdx < renderTabs.value.length) {
        selectedDash.value = renderTabs.value[newSelIdx].name;
      } else {
        selectedDash.value = undefined;
      }
    }
    quickDashConfig.value.splice(idx, 1);
  }
}

const pageData = computed(() => {
  const data = quickDashConfig.value.find(
    (x) => x.name == selectedDash.value
  );
  if (data) {
    return data.groupList;
  } else {
    return [];
  }
});

const groupNames = computed(() => pageData.value.map((x) => x.name));

const displayPage = computed(() => {
  const items = pageData.value;
  const columns = numberOfColumns.value;

  // Calculate the total number of links, plus one for each item itself
  const totalLinks = items.reduce((sum, item) => sum + item.linkList.length + 1, 0);

  // Calculate the target number of links per column
  const targetLinksPerColumn = Math.floor((totalLinks + items.length) / columns);

  const resultArray: LinkGroup[][] = Array.from({ length: columns }, () => []);
  let currentColumn = 0;
  let currentLinkCount = 0;

  // Distribute the cards across columns
  items.forEach(item => {
    const cardLinkCount = item.linkList.length + 1; // +1 for the item itself

    // If adding this card would exceed the target, move to the next column
    if (currentLinkCount + cardLinkCount > targetLinksPerColumn && currentColumn < columns - 1) {
      currentColumn++;
      currentLinkCount = 0; // Reset the count when switching columns
    }

    // Add the item to the current column
    resultArray[currentColumn].push(item);
    currentLinkCount += cardLinkCount;
  });

  return resultArray;
});


function getCurrentDash() {
  return quickDashConfig.value.find((x) => x.name == selectedDash.value);
}

function addGroup(item: { name: string; icon?: string; color?: string }) {
  const data = getCurrentDash();
  if (data) {
    data.groupList.push({
      name: item.name,
      linkList: [],
      icon: item.icon,
      color: item.color
    });
  }
}

function updateGroup(
  item: { name: string; icon?: string; color?: string },
  oldName: string
) {
  const data = getCurrentDash();
  if (data) {
    const grpRec = data.groupList.find((x) => x.name == oldName);
    if (grpRec) {
      grpRec.name = item.name;
      grpRec.icon = item.icon;
      grpRec.color = item.color;
    }
  }
}

function deleteGroup(name: string) {
  const data = getCurrentDash();
  if (data) {
    const idx = data.groupList.findIndex((x) => x.name == name);
    if (idx != -1) {
      data.groupList.splice(idx, 1);
    }
  }
}

function moveGroup(name: string, direction: number) {
  const data = getCurrentDash();
  if (data) {
    const idx = data.groupList.findIndex((x) => x.name == name);
    const newIndex = idx + direction;
    if (newIndex >= data.groupList.length) {
      var k = newIndex - data.groupList.length + 1;
      while (k--) {
        data.groupList.push({ name: "", linkList: [] });
      }
    }
    data.groupList.splice(newIndex, 0, data.groupList.splice(idx, 1)[0]);
  }
}

function moveLink(groupName: string, index: number, direction: number) {
  const data = getCurrentDash();
  if (data) {
    const groupData = data.groupList.find((x) => x.name == groupName);
    if (groupData) {
      const newIndex = index + direction;
      if (newIndex >= groupData.linkList.length) {
        var k = newIndex - groupData.linkList.length + 1;
        while (k--) {
          groupData.linkList.push({
            text: "",
            url: "",
            color: "",
            outline: false
          });
        }
      }
      groupData.linkList.splice(
        newIndex,
        0,
        groupData.linkList.splice(index, 1)[0]
      );
    }
  }
}
const tabEdit = ref(false);
function moveDash(direction: number) {
  const index = quickDashConfig.value.findIndex(
    (x) => x.name == selectedDash.value
  );
  if (index != -1) {
    const newIndex = index + direction;
    if (newIndex >= quickDashConfig.value.length) {
      var k = newIndex - quickDashConfig.value.length + 1;
      while (k--) {
        quickDashConfig.value.push({ name: "", groupList: [] });
      }
    }
    quickDashConfig.value.splice(
      newIndex,
      0,
      quickDashConfig.value.splice(index, 1)[0]
    );
  }
}
</script>
<template>
  <v-tabs v-model="tab"
    ><v-tab
      :prepend-icon="t.icon"
      v-for="(t, i) in renderTabs"
      class="rounded-b-lg"
      :key="t.name"
      :value="t.name"
      :class="t.color ? `bg-${t.color}` : ''"
      >{{ t.name }}
      <v-expand-x-transition>
        <div
          class="ml-3 rounded-xl px-1 d-flex"
          style="border: 1px solid grey"
          v-if="t.name == selectedDash"
        >
          <v-expand-x-transition
            ><div v-show="tabEdit">
              <v-btn size="30" variant="text" rounded="pill"
                ><v-icon icon="mdi-pencil"></v-icon
                ><AddItem
                  :current-name="t.name"
                  type-name="Dash"
                  :current-color="t.color"
                  :current-icon="t.icon"
                  @update:item="(v) => updateDash(v, t.name)"
                  @delete:name="() => deleteDash(t.name)"
                  :existing-items="
                    renderTabs
                      .filter((x) => x.name != t.name)
                      .map((x) => x.name)
                  "
                /><v-tooltip activator="parent">Edit Dash</v-tooltip></v-btn
              ><v-btn
                size="30"
                variant="text"
                rounded="pill"
                v-if="i != 0"
                @click="moveDash(-1)"
                ><v-icon icon="mdi-chevron-left"></v-icon
                ><v-tooltip activator="parent"
                  >Move Dash Left</v-tooltip
                ></v-btn
              >
              <v-btn
                size="30"
                variant="text"
                rounded="pill"
                v-if="i != renderTabs.length - 1"
                @click="moveDash(1)"
                ><v-icon icon="mdi-chevron-right"></v-icon
                ><v-tooltip activator="parent"
                  >Move Dash Right</v-tooltip
                ></v-btn
              >
            </div>
          </v-expand-x-transition>
          <v-btn
            variant="text"
            size="30"
            rounded="pill"
            @click="tabEdit = !tabEdit"
            ><v-icon icon="mdi-playlist-edit" /><v-tooltip
              activator="parent"
              >{{ tabEdit ? "Hide Controls" : "Show Controls" }}</v-tooltip
            ></v-btn
          >
        </div></v-expand-x-transition
      ></v-tab
    ><v-btn size="large" variant="text"
      ><v-icon icon="mdi-plus"></v-icon
      ><AddItem
        @update:item="addDash"
        type-name="Dash"
        :existing-items="renderTabs.map((x) => x.name)"
      /><v-tooltip activator="parent">Add Dash</v-tooltip></v-btn
    ></v-tabs
  >
  <v-container class="scroll-lock d-flex">
    <div
      v-for="(row, idx) in displayPage"
      :key="`row-${idx}`"
      :style="`min-width: ${100 / numberOfColumns}%`"
    >
      <v-col v-for="(col, idc) in row" :key="`col-${idx}-${idc}`">
        <LinkCard
          :name="col.name"
          :icon="col.icon"
          :color="col.color"
          :link-list="col.linkList"
          :move-left="idx + idc != 0"
          :move-right="
            !(
              idx == displayPage.length - 1 &&
              idc == displayPage[displayPage.length - 1].length - 1
            )
          "
          :dash-group-names="groupNames"
          @update:item="(v) => updateGroup(v, col.name)"
          @delete:name="deleteGroup"
          @move:group="(v) => moveGroup(col.name, v)"
          @move:link="(v) => moveLink(col.name, v.index, v.direction)"
        />
      </v-col>
      <v-col>
        <LinkCard
          v-if="displayPage.length != 0 && idx == displayPage.length - 1"
          name="Add Group"
          :link-list="[]"
          :add-mode="true"
          :dash-group-names="groupNames"
          @add:item="addGroup"
      /></v-col>
    </div>
    <v-row v-if="displayPage.length == 0 && renderTabs.length != 0"
      ><v-col :cols="colCt"
        ><LinkCard
          name="Add Group"
          :link-list="[]"
          :add-mode="true"
          :dash-group-names="groupNames"
          @add:item="addGroup"
      /></v-col>
    </v-row>
    <v-row v-if="renderTabs.length == 0"
      ><v-col
        ><v-card variant="outlined"
          ><v-card-title>Welcome to QuickDash!</v-card-title
          ><v-card-text class="d-flex align-center"
            ><span
              >There currently no dashboards to display. To start a new one,
              use the add <v-icon icon="mdi-plus" class="mx-1" />
              button in the left right corner or use the settings menu <v-icon icon="mdi-cog" class="mx-1" />
              in the upper right corner to import an existing dashboard.</span
            ></v-card-text
          ></v-card
        ></v-col
      ></v-row
    >
  </v-container>
</template>
