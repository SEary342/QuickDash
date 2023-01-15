<script setup lang="ts">
import { ref, watchEffect, computed, type PropType } from "vue";
import ConfirmationDialog from "./ConfirmationDialog.vue";

const props = defineProps({
  currentName: { type: String, default: "" },
  typeName: { type: String, required: true },
  existingItems: { type: Array as PropType<string[]>, required: true }
});

const emits = defineEmits<{
  (e: "update:name", value: string): void;
  (e: "delete:name", value: string): void;
}>();

const lowerItems = computed(() =>
  props.existingItems.map((x) => x.toLowerCase())
);

const editName = ref<string>("");
const dialog = ref(false);

watchEffect(() => {
  if (dialog.value) {
    editName.value = props.currentName;
  }
});

const rules = {
  required: (v: string) => !!v || "Name is required",
  noCollision: (v: string) =>
    !lowerItems.value.includes(v.toLowerCase()) ||
    `${props.typeName} already exists!`
};

function save() {
  emits("update:name", editName.value);
  reset();
}

function reset() {
  editName.value = "";
  dialog.value = false;
}

function deleteItem() {
  emits("delete:name", props.currentName);
  reset();
}
</script>

<template>
  <v-dialog activator="parent" v-model="dialog" width="600">
    <v-card
      :title="
        props.currentName.length == 0 ? `New ${typeName}` : `Edit ${typeName}`
      "
    >
      <v-card-text
        ><v-text-field
          label="Group Name"
          v-model="editName"
          :rules="[rules.required, rules.noCollision]"
        ></v-text-field
      ></v-card-text>
      <v-card-actions class="mb-3 mx-3 justify-space-between d-flex"
        ><v-btn color="grey" @click="reset">Cancel</v-btn>
        <v-btn class="bg-error" v-if="props.currentName.length != 0"
          >Delete<ConfirmationDialog
            :text="`Are you sure you want to delete ${typeName}: ${props.currentName}`"
            @confirm="deleteItem" /></v-btn
        ><v-btn
          class="bg-primary"
          :disabled="
            editName.length == 0 ||
            editName == props.currentName ||
            rules.noCollision(editName) != true
          "
          @click="save"
          >Save</v-btn
        ></v-card-actions
      >
    </v-card>
  </v-dialog>
</template>
