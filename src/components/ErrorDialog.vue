<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  text: { type: String, required: true }
});
const emits = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const dialog = computed({
  get: () => props.modelValue,
  set: (value) => emits("update:modelValue", value)
});
</script>
<template>
  <v-dialog width="400" v-model="dialog"
    ><v-card title="Error" color="error"
      ><v-card-text>{{ text }}</v-card-text
      ><v-card-actions class="mb-3 mx-3"
        ><v-spacer></v-spacer
        ><v-btn @click="dialog = false">Ok</v-btn></v-card-actions
      ></v-card
    ></v-dialog
  >
</template>
