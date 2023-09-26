<script setup lang="ts">
import { colorOptionsArray, iconOptionsArray } from "@/configStructure";
import { ref, watchEffect, computed, type PropType } from "vue";
import ConfirmationDialog from "./ConfirmationDialog.vue";

const props = defineProps({
  currentName: { type: String, default: "" },
  currentIcon: { type: String },
  currentColor: { type: String },
  typeName: { type: String, required: true },
  existingItems: { type: Array as PropType<string[]>, required: true }
});

const emits = defineEmits<{
  (
    e: "update:item",
    value: { name: string; icon?: string; color?: string }
  ): void;
  (e: "delete:name", value: string): void;
}>();

const lowerItems = computed(() =>
  props.existingItems.map((x) => x.toLowerCase())
);

const editName = ref<string>("");
const editColor = ref<string>();
const editIcon = ref<string>();
const dialog = ref(false);

watchEffect(() => {
  if (dialog.value) {
    editName.value = props.currentName;
    editColor.value = props.currentColor;
    editIcon.value = props.currentIcon;
  }
});

const rules = {
  required: (v: string) => !!v || "Name is required",
  noCollision: (v: string) =>
    !lowerItems.value.includes(v.toLowerCase()) ||
    `${props.typeName} already exists!`
};

function save() {
  emits("update:item", {
    name: editName.value,
    icon: editIcon.value,
    color: editColor.value
  });
  reset();
}

const saveEnabled = computed(() => {
  return (
    editName.value.length != 0 &&
    rules.noCollision(editName.value) == true &&
    (editName.value != props.currentName ||
      editIcon.value != props.currentIcon ||
      editColor.value != props.currentColor)
  );
});

function reset() {
  editName.value = "";
  editColor.value = undefined;
  editIcon.value = undefined;
  dialog.value = false;
}

function deleteItem() {
  emits("delete:name", props.currentName);
  reset();
}
</script>

<template>
  <v-dialog activator="parent" v-model="dialog" width="600" persistent>
    <v-card
      :title="
        props.currentName.length == 0 ? `New ${typeName}` : `Edit ${typeName}`
      "
    >
      <v-card-text
        ><v-text-field
          variant="outlined"
          :label="`${typeName} Name`"
          v-model="editName"
          :rules="[rules.required, rules.noCollision]"
          hide-details="auto"
          class="mb-3"
        ></v-text-field>
        <v-autocomplete
          label="Color"
          variant="outlined"
          v-model="editColor"
          :items="colorOptionsArray"
          hide-details
          class="mb-3"
        >
          <template v-slot:prepend-inner v-if="editColor">
            <v-avatar size="24" :color="editColor"></v-avatar>
          </template>
          <template v-slot:item="{ props, item }">
            <v-list-item v-bind="props" :title="item.raw.title">
              <template v-slot:prepend>
                <v-avatar :color="item.raw.value" size="24"></v-avatar>
              </template>
            </v-list-item>
          </template>
        </v-autocomplete>
        <v-autocomplete
          variant="outlined"
          label="Icon"
          v-model="editIcon"
          :prepend-inner-icon="editIcon"
          :items="iconOptionsArray"
          hide-details
          class="mb-3"
        >
          <template v-slot:item="{ props, item }">
            <v-list-item v-bind="props" :title="item.raw.title">
              <template v-slot:prepend>
                <v-icon :icon="item.raw.value"></v-icon>
              </template>
            </v-list-item>
          </template> </v-autocomplete
      ></v-card-text>

      <v-card-actions class="mb-3 mx-3 justify-space-between d-flex"
        ><v-btn color="grey" @click="reset">Cancel</v-btn>
        <v-btn class="bg-error" v-if="props.currentName.length != 0"
          >Delete<ConfirmationDialog
            :text="`Are you sure you want to delete ${typeName}: ${props.currentName}`"
            @confirm="deleteItem" /></v-btn
        ><v-btn class="bg-primary" :disabled="!saveEnabled" @click="save"
          >Save</v-btn
        ></v-card-actions
      >
    </v-card>
  </v-dialog>
</template>
