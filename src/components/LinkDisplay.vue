<script setup lang="ts">
import type { PropType } from "vue";
import { LinkData } from "@/configStructure";
import LinkDialog from "./LinkDialog.vue";

const props = defineProps({
  btn: { type: Object as PropType<LinkData>, required: true },
  editMode: { type: Boolean, default: false },
  hoverColor: { type: String },
  index: { type: Number, required: true },
  moveUp: { type: Function as PropType<(index: number) => void> },
  moveDown: { type: Function as PropType<(index: number) => void> }
});


function moveItemUp(){
    if (props.moveUp){
        props.moveUp(props.index);
    }
}

function moveItemDown(){
    if (props.moveDown){
        props.moveDown(props.index);
    }
}

</script>
<template>
  <v-card
    class="my-3 d-flex w-100 text-button"
    rounded="lg"
    :class="!btn.outline ? `bg-${btn.color}` : ''"
    :color="btn.outline ? btn.color : undefined"
    :variant="btn.outline ? 'outlined' : undefined"
    :href="btn.url.length > 0 ? btn.url : undefined"
    role="button"
    target="_blank"
    ><v-card-title
      class="d-flex justify-space-between w-100"
      :class="hoverColor ? `bg-${hoverColor}` : ''"
    >
      <div>
        <v-icon v-if="btn.icon" :icon="btn.icon" class="pl-3 pr-5"></v-icon>
        {{ btn.text }}
      </div>
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
            ><LinkDialog :data-model="btn" /><v-tooltip activator="parent"
              >Edit Link</v-tooltip
            ></v-btn
          >
        </div></v-expand-x-transition
      >
      <slot></slot>
    </v-card-title>
  </v-card>
</template>
