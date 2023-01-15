<script setup lang="ts">
import type { LinkData } from "@/configStructure";
import { ref, watchEffect, computed, type PropType } from "vue";
import { cloneDeep } from "lodash";
import ConfirmationDialog from "./ConfirmationDialog.vue";
import LinkDisplay from "./LinkDisplay.vue";

const props = defineProps({
  dataModel: { type: Object as PropType<LinkData> }
});
const emits = defineEmits<{
  (e: "add:link", value: LinkData): void;
  (e: "update:link", value: LinkData): void;
  (e: "delete:link", value: LinkData): void;
}>();

function getLink(): LinkData {
  return { text: "", url: "", color: "", outline: false, icon: undefined };
}

const editLink = ref<LinkData>(getLink());

const dialog = ref(false);

const dataChanged = computed(
  () => JSON.stringify(props.dataModel) != JSON.stringify(editLink)
);

// TODO implement rules and add validation
// TODO implement color & icon selection

const dataValid = computed(() => {
  // TODO implement checks
  return editLink.value.text.length > 0;
});

watchEffect(() => {
  if (dialog.value && props.dataModel) {
    editLink.value = cloneDeep(props.dataModel);
  }
});

function reset() {
  dialog.value = false;
  editLink.value = getLink();
}

function deleteLink() {
  emits("delete:link", editLink.value)
  reset();
}
function save() {
  if (props.dataModel == undefined){
    emits("add:link", editLink.value)
  }
  else{
    emits("update:link", editLink.value)
  }
  
  reset();
}
</script>

<template>
  <v-dialog activator="parent" v-model="dialog" width="600">
    <v-card>
      <v-card-title>Link</v-card-title>
      <v-card-text>
        <v-text-field
          variant="outlined"
          label="Link Name"
          v-model="editLink.text"
        ></v-text-field>
        <v-text-field
          variant="outlined"
          placeholder="https://"
          v-model="editLink.url"
          label="Link URL"
        ></v-text-field>
        <v-select
          variant="outlined"
          label="Color"
          v-model="editLink.color"
        ></v-select>
        <v-switch label="Outlined" v-model="editLink.outline"></v-switch>
        <v-select
          variant="outlined"
          label="Icon"
          v-model="editLink.icon"
        ></v-select>
        <v-expand-transition>
          <v-container class="text-overline" v-show="dataValid">
            <v-divider></v-divider>Preview
            <LinkDisplay
              :btn="editLink"
              :index="-1"
            /> </v-container
        ></v-expand-transition>
      </v-card-text>
      <v-card-actions class="mb-3 mx-3 justify-space-between d-flex"
        ><v-btn color="grey" @click="reset">Cancel</v-btn>
        <v-btn class="bg-error" v-if="props.dataModel"
          >Delete<ConfirmationDialog
            text="Are you sure you want to delete this link?"
            @confirm="deleteLink" /></v-btn
        ><v-btn
          class="bg-primary"
          :disabled="!dataChanged || !dataValid"
          @click="save"
          >Save</v-btn
        ></v-card-actions
      >
    </v-card>
  </v-dialog>
</template>
