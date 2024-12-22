<script setup lang="ts">
import type { LinkData } from "@/configStructure";
import type { PropType } from "vue";
import { ref } from "vue";
import LinkDialog from "./LinkDialog.vue";
import AddItem from "./AddItem.vue";
import LinkEditor from "./LinkEditor.vue";
import LinkDisplay from "./LinkDisplay.vue";

defineProps({
  name: { type: String, required: true },
  linkList: { type: Array as PropType<LinkData[]>, required: true },
  icon: { type: String },
  color: { type: String, default: "grey-lighten-4" },
  moveLeft: { type: Boolean, default: false },
  moveRight: { type: Boolean, default: false },
  addMode: { type: Boolean, default: false },
  dashGroupNames: { type: Array as PropType<string[]>, required: true }
});

const emits = defineEmits<{
  (
    e: "add:item",
    value: { name: string; icon?: string; color?: string }
  ): void;
  (
    e: "update:item",
    value: { name: string; icon?: string; color?: string }
  ): void;
  (e: "delete:name", value: string): void;
  (e: "move:group", value: number): void;
  (e: "move:link", value: { index: number; direction: number }): void;
}>();

const editMode = ref<boolean>(false);

function moveUp(index: number) {
  emits("move:link", { index: index, direction: -1 });
}

function moveDown(index: number) {
  emits("move:link", { index: index, direction: 1 });
}
</script>
<template>
  <v-card variant="outlined" class="mx-6 my-3"
    ><v-card-title
      class="justify-space-between d-flex align-center"
      :class="`bg-${color}`"
      ><div class="d-flex align-center" :class="addMode ? 'font-italic' : ''">
        <div>
          <v-icon v-if="icon" :icon="icon" class="pl-3 pr-5"></v-icon>
          {{ name }}
        </div>
        <v-expand-x-transition
          ><div v-show="editMode">
            <v-btn variant="text" size="35" rounded="pill" class="ml-2"
              ><v-icon icon="mdi-pencil"></v-icon
              ><v-tooltip activator="parent">Edit Group</v-tooltip>
              <AddItem
                :current-name="name"
                :current-color="color"
                :current-icon="icon"
                type-name="Group"
                :existing-items="dashGroupNames.filter((x) => x != name)"
                @update:item="(v) => emits('update:item', v)"
                @delete:name="(v) => emits('delete:name', v)"
              />
            </v-btn>
            <v-btn
              variant="text"
              size="35"
              rounded="pill"
              class="ml-2"
              v-if="moveLeft"
              @click="emits('move:group', -1)"
              ><v-icon icon="mdi-chevron-up"></v-icon
              ><v-tooltip activator="parent">Move Up</v-tooltip> </v-btn
            ><v-btn
              variant="text"
              size="35"
              rounded="pill"
              class="ml-2"
              v-if="moveRight"
              @click="emits('move:group', 1)"
              ><v-icon icon="mdi-chevron-down"></v-icon
              ><v-tooltip activator="parent">Move Down</v-tooltip>
            </v-btn>
          </div></v-expand-x-transition
        >
      </div>
      <v-btn
        v-if="!addMode"
        :variant="editMode ? 'outlined' : 'text'"
        @click="editMode = !editMode"
        size="35"
        rounded="pill"
        ><v-icon icon="mdi-playlist-edit"></v-icon
        ><v-tooltip location="top" activator="parent"
          >Toggle Group Controls</v-tooltip
        ></v-btn
      >
      <v-btn v-else variant="outlined" width="150"
        ><v-tooltip activator="parent">Add Group</v-tooltip
        ><v-icon icon="mdi-plus"></v-icon>
        <AddItem
          type-name="Group"
          :existing-items="dashGroupNames"
          @update:item="(v) => emits('add:item', v)" /></v-btn></v-card-title
    ><v-card-text>
      <LinkEditor
        v-for="(btn, i) in linkList"
        :key="`link-${name}-${i}`"
        :btn="btn"
        :edit-mode="editMode"
        :index="i"
        :move-up="i != 0 ? moveUp : undefined"
        :move-down="i != linkList?.length - 1 ? moveDown : undefined"
        @update:link="(v) => (linkList[v.index] = v.data)"
        @delete:link="(v) => linkList.splice(v, 1)"
      ></LinkEditor
      ><v-expand-transition>
        <div v-show="editMode">
          <v-hover>
            <template v-slot:default="{ isHovering, props }">
              <LinkDisplay
                v-bind="props"
                :btn="{
                  text: 'Add Link',
                  url: '',
                  color: '',
                  icon: 'mdi-plus',
                  outline: true
                }"
                :index="-1"
                :edit-mode="false"
                :hover-color="isHovering ? 'grey-lighten-5' : undefined"
                ><LinkDialog
                  @add:link="
                    (v) => linkList.push(v)
                  " /></LinkDisplay></template
          ></v-hover></div
      ></v-expand-transition>
    </v-card-text>
  </v-card>
</template>
