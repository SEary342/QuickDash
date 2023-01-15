<script setup lang="ts">
import type { LinkData } from "@/configStructure";
import type { PropType } from "vue";
import { ref, computed } from "vue";
import LinkDialog from "./LinkDialog.vue";
import LinkDisplay from "./LinkDisplay.vue";
import AddItem from "./AddItem.vue";

const props = defineProps({
  name: { type: String, required: true },
  linkList: { type: Array as PropType<LinkData[]>, required: true },
  moveLeft: { type: Boolean, default: false },
  moveRight: { type: Boolean, default: false },
  addMode: { type: Boolean, default: false },
  dashGroupNames: { type: Array as PropType<string[]>, required: true }
});

const emits = defineEmits<{
  (e: "add:name", value: string): void;
  (e: "update:name", value: string): void;
  (e: "delete:name", value: string): void;
  (e: "move:group", value: number): void;
}>();

const editMode = ref<number>();

const editActive = computed(() => editMode.value != undefined);

// TODO implement move systems

function moveUp(index: number) {}

function moveDown(index: number) {}
</script>
<template>
  <v-card variant="outlined" class="mx-6 my-3"
    ><v-card-title
      class="bg-grey-lighten-4 justify-space-between d-flex align-center"
      ><div class="d-flex align-center" :class="addMode ? 'font-italic' : ''">
        {{ name
        }}<v-expand-x-transition
          ><div v-show="editActive">
            <v-btn variant="text" size="35" rounded="pill" class="ml-2"
              ><v-icon icon="mdi-pencil"></v-icon
              ><v-tooltip activator="parent">Edit Group</v-tooltip>
              <AddItem
                :current-name="name"
                type-name="Group"
                :existing-items="dashGroupNames.filter((x) => x != name)"
                @update:name="(v) => emits('update:name', v)"
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
              ><v-icon icon="mdi-chevron-left"></v-icon
              ><v-tooltip activator="parent">Move Left</v-tooltip> </v-btn
            ><v-btn
              variant="text"
              size="35"
              rounded="pill"
              class="ml-2"
              v-if="moveRight"
              @click="emits('move:group', 1)"
              ><v-icon icon="mdi-chevron-right"></v-icon
              ><v-tooltip activator="parent">Move Right</v-tooltip>
            </v-btn>
          </div></v-expand-x-transition
        >
      </div>

      <v-btn-toggle
        v-model="editMode"
        class="d-flex align-center"
        v-if="!addMode"
        ><v-btn variant="text" size="35" rounded="pill"
          ><v-icon icon="mdi-playlist-edit"></v-icon
          ><v-tooltip location="top" activator="parent"
            >Toggle Group Controls</v-tooltip
          ></v-btn
        ></v-btn-toggle
      ><v-btn v-else variant="outlined" width="300"
        ><v-tooltip activator="parent">Add Group</v-tooltip
        ><v-icon icon="mdi-plus"></v-icon>
        <AddItem
          type-name="Group"
          :existing-items="dashGroupNames"
          @update:name="(v) => emits('add:name', v)" /></v-btn></v-card-title
    ><v-card-text>
      <LinkDisplay
        v-for="(btn, i) in linkList"
        :key="`link-${name}-${i}`"
        :btn="btn"
        :edit-mode="editActive"
        :index="i"
        :move-up="i != 0 ? moveUp : undefined"
        :move-down="i != linkList?.length - 1 ? moveDown : undefined"
        @update:link="(v) => (linkList[v.index] = v.data)"
        @delete:link="(v) => linkList.splice(v, 1)"
      ></LinkDisplay
      ><v-expand-transition>
        <div v-show="editActive">
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
