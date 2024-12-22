<script setup lang="ts">
import type { PropType } from "vue";
import { LinkData } from "@/configStructure";
import LinkDialog from "./LinkDialog.vue";
import LinkDisplay from "./LinkDisplay.vue";

const props = defineProps({
  btn: { type: Object as PropType<LinkData>, required: true },
  editMode: { type: Boolean, default: false },
  hoverColor: { type: String },
  index: { type: Number, required: true },
  moveUp: { type: Function as PropType<(index: number) => void> },
  moveDown: { type: Function as PropType<(index: number) => void> }
});

const emits = defineEmits<{
  (e: "update:link", value: { index: number; data: LinkData }): void;
  (e: "delete:link", value: number): void;
}>();

function moveItemUp() {
  if (props.moveUp) {
    props.moveUp(props.index);
  }
}

function moveItemDown() {
  if (props.moveDown) {
    props.moveDown(props.index);
  }
}
</script>
<template>
  <LinkDisplay :btn="btn" :hover-color="hoverColor">
    <template #editFunc>
      <v-expand-x-transition
        ><div v-show="editMode">
          <v-btn
            size="30"
            variant="text"
            v-if="moveUp != undefined"
            @click.prevent="moveItemUp"
            ><v-icon icon="mdi-chevron-up"></v-icon
            ><v-tooltip activator="parent">Move Up</v-tooltip></v-btn
          ><v-btn
            size="30"
            variant="text"
            @click.prevent="moveItemDown"
            v-if="moveDown != undefined"
            ><v-icon icon="mdi-chevron-down"></v-icon
            ><v-tooltip activator="parent">Move Down</v-tooltip></v-btn
          >
          <v-btn size="30" variant="text" @click.prevent
            ><v-icon icon="mdi-pencil"></v-icon
            ><LinkDialog
              :data-model="btn"
              @update:link="
                (v) => emits('update:link', { index: index, data: v })
              "
              @delete:link="(_) => emits('delete:link', index)"
            /><v-tooltip activator="parent">Edit Link</v-tooltip></v-btn
          >
        </div></v-expand-x-transition
      ></template
    >
  </LinkDisplay>
</template>
