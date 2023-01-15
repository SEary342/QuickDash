<script setup lang="ts">
import { readFile } from "@/utility";
import { ref } from "vue";
import ErrorDialog from "./ErrorDialog.vue";
const fileInput = ref<File[]>();
const display = ref(false);

function reset() {
  fileInput.value = undefined;
  display.value = false;
}

const importError = ref(false);
async function save() {
  if (fileInput.value) {
    try {
      const data = await readFile(fileInput.value[0]);
      //TODO write the file to the store
      reset();
    } catch (err) {
      importError.value = true;
    }
  }
}
</script>

<template>
  <v-dialog width="600" activator="parent" v-model="display" persistent>
    <v-card>
      <v-card-title>Upload QuickDash Configuration JSON</v-card-title>
      <v-card-text>
        <p class="text-error pb-3">
          Warning: Uploading a file will replace all content in QuickDash!
        </p>
        <v-divider class="pb-3"></v-divider>
        <v-file-input
          v-model="fileInput"
          label="File Name"
          accept=".QDconfig"
          placeholder="Choose a file..."
          prepend-icon="mdi-file-code-outline"
        ></v-file-input>
      </v-card-text>
      <v-card-actions class="mb-3 mx-3 justify-space-between"
        ><v-btn color="grey" @click="reset">Cancel</v-btn><v-btn
          class="bg-primary"
          :disabled="fileInput == undefined"
          @click="save"
          >Upload</v-btn
        ></v-card-actions
      >
    </v-card>
    <ErrorDialog
      v-model="importError"
      text="An import error occured."
      @update:model-value="
        (v) => {
          if (!v) {
            reset();
          }
        }
      "
    />
  </v-dialog>
</template>
