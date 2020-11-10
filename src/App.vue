<template>
  <div id="app">
    <b-navbar variant="dark" type="dark" fluid
      ><b-navbar-brand fluid
        ><b-img fluid :src="require('./assets/favicon-32x32.png')"></b-img>
        QuickDash</b-navbar-brand
      >
      <b-navbar-nav class="ml-auto">
        <b-nav-item-dropdown right>
          <template #button-content> <BIconGearFill /> </template>
          <b-dropdown-item-button v-b-modal.upload-modal
            >Import</b-dropdown-item-button
          >
          <b-dropdown-item-button
            v-if="$store.getters.dashNames.length > 0"
            @click="exportConfig"
            >Export</b-dropdown-item-button
          >
          <b-dropdown-divider></b-dropdown-divider>
          <b-dropdown-form>
            <b-form-group label="Columns"
              ><b-form-spinbutton
                v-model="dispColumns"
                class="w-100"
              ></b-form-spinbutton
            ></b-form-group>
          </b-dropdown-form>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-navbar>
    <LinkPanel class="mt-3" />
    <b-modal
      id="upload-modal"
      title="Upload QuickDash Configuration JSON"
      @ok="importConfig"
      :ok-disabled="uploadFile === null"
      ok-title="Upload"
      @hide="uploadFile = null"
      ><h6 class="text-danger">
        Warning: Uploading a file will replace all content in QuickDash!
      </h6>
      <hr />
      <b-form-file
        accept=".json"
        v-model="uploadFile"
        placeholder="Choose a file or drop it here..."
        drop-placeholder="Drop file here..."
      ></b-form-file
    ></b-modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import LinkPanel from "./components/LinkPanel.vue";

@Component({
  components: {
    LinkPanel
  }
})
export default class App extends Vue {
  uploadFile: File | null = null;

  get dispColumns() {
    return this.$store.getters.numberOfColumns;
  }

  set dispColumns(colValue) {
    this.$store.commit("setNumberOfColumns", colValue);
  }

  importConfig() {
    const reader = new FileReader();
    reader.readAsText(this.uploadFile as File);
    reader.onload = () => {
      this.$store.commit("importConfig", JSON.parse(String(reader.result)));
    };
    reader.onerror = () => {
      this.$bvModal.msgBoxOk(String(reader.error), {
        title: "Import Error",
        okVariant: "danger"
      });
    };
  }

  exportConfig() {
    const jsonFile = JSON.stringify(this.$store.getters.exportData);
    const blob = new Blob([jsonFile], { type: "application/json" });
    if (navigator.msSaveBlob) {
      // IE 10+
      navigator.msSaveBlob(blob, "QuickDashConfig");
    } else {
      const link = document.createElement("a");
      if (link.download !== undefined) {
        // feature detection
        // Browsers that support HTML5 download attribute
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "QuickDashConfig".concat(".json"));
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }
}
</script>
