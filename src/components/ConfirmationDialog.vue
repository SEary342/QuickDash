<script setup lang="ts">
import { ref } from "vue";

const props = defineProps({
  text: { type: String, required: true },
  confirmText: { type: String, default: "Ok" },
  color: { type: String, default: "warning" }
});
const emits = defineEmits<{
  (e: "confirm", value: boolean): void;
}>();
const dialog = ref(false);
function confirm() {
  emits("confirm", true);
  dialog.value = false;
}
</script>
<template>
  <v-dialog width="400" activator="parent" v-model="dialog"
    ><v-card title="Confirmation"
      ><v-card-text :color="color">{{ text }}</v-card-text
      ><v-card-actions class="mb-3 mx-3 justify-space-between"
        ><v-btn color="grey" @click="dialog = false">Cancel</v-btn
        ><v-btn @click="confirm" class="bg-error">{{
          confirmText
        }}</v-btn></v-card-actions
      ></v-card
    ></v-dialog
  >
</template>
