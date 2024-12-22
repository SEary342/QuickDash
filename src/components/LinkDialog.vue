<script setup lang="ts">
import type { LinkData } from "@/configStructure";
import { ref, watchEffect, computed } from "vue";
import ConfirmationDialog from "./ConfirmationDialog.vue";
import LinkDisplay from "./LinkDisplay.vue";
import { colorOptionsArray, iconOptionsArray } from "@/configStructure";

const props = defineProps<{ dataModel?: LinkData }>();

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
  () => JSON.stringify(props.dataModel) != JSON.stringify(editLink.value)
);

const rules = {
  required: (v: string) => !!v || "Field is required",
  validURL: (v: string) => {
    let url;
    try {
      url = new URL(v);
    } catch (_) {
      return "URL is not valid";
    }
    return (
      ["http:", "https:"].includes(url.protocol) || "URL protocol not valid"
    );
  }
};

const dataValid = computed(() => {
  return [
    rules.required(editLink.value.text),
    rules.required(editLink.value.url),
    rules.validURL(editLink.value.url)
  ].every((v) => v === true);
});

watchEffect(() => {
  if (dialog.value && props.dataModel) {
    editLink.value = {...props.dataModel};
  }
});

function reset() {
  dialog.value = false;
  editLink.value = getLink();
}

function deleteLink() {
  emits("delete:link", editLink.value);
  reset();
}
function save() {
  if (props.dataModel == undefined) {
    emits("add:link", editLink.value);
  } else {
    emits("update:link", editLink.value);
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
          density="compact"
          variant="outlined"
          label="Link Name"
          v-model="editLink.text"
          class="mb-3"
          :rules="[rules.required]"
          hide-details="auto"
        ></v-text-field>
        <v-text-field
          density="compact"
          variant="outlined"
          placeholder="https://"
          v-model="editLink.url"
          :rules="[rules.required, rules.validURL]"
          label="Link URL"
          class="mb-3"
          hide-details="auto"
        ></v-text-field>
        <v-autocomplete
          density="compact"
          variant="outlined"
          label="Color"
          hide-details
          class="mb-3"
          v-model="editLink.color"
          :items="colorOptionsArray"
        >
          <template v-slot:prepend-inner>
            <v-avatar
              size="24"
              :color="editLink.color ? editLink.color : undefined"
            ></v-avatar>
          </template>
          <template v-slot:item="{ props, item }">
            <v-list-item v-bind="props" :title="item.raw.title">
              <template v-slot:prepend>
                <v-avatar size="24" :color="item.raw.value"></v-avatar>
              </template>
            </v-list-item>
          </template>
        </v-autocomplete>
        <v-switch
          label="Outlined"
          v-model="editLink.outline"
          hide-details
          class="mb-3"
          color="primary"
          density="compact"
        ></v-switch>
        <v-autocomplete
          variant="outlined"
          label="Icon"
          class="mb-3"
          density="compact"
          v-model="editLink.icon"
          :items="iconOptionsArray"
          :prepend-inner-icon="editLink.icon ? editLink.icon : undefined"
        >
          <template v-slot:item="{ props, item }">
            <v-list-item v-bind="props" :title="item.raw.title">
              <template v-slot:prepend>
                <v-icon :icon="item.raw.value"></v-icon>
              </template>
            </v-list-item>
          </template>
        </v-autocomplete>
        <v-expand-transition>
          <v-container class="text-overline" v-show="dataValid">
            <v-divider></v-divider>Preview
            <LinkDisplay :btn="editLink" :index="-1" /></v-container
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
