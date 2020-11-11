<template>
  <div id="app">
    <b-navbar variant="dark" type="dark" fluid
      ><b-navbar-brand fluid><qdLogo /> QuickDash</b-navbar-brand>
      <b-navbar-nav class="ml-auto">
        <b-nav-item-dropdown right>
          <template #button-content> <BIconGearFill /> </template>
          <b-dropdown-item-button @click="showUpload"
            >Import</b-dropdown-item-button
          >
          <b-dropdown-item-button
            v-if="$store.getters.dashNames.length > 0"
            @click="exportFullConfig"
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
      @ok="importFullConfig"
      :ok-disabled="uploadFile === null"
      ok-title="Upload"
      @hide="uploadFile = null"
      ><h6 class="text-danger">
        Warning: Uploading a file will replace all content in QuickDash!
      </h6>
      <hr />
      <b-form-file
        accept=".QDconfig"
        v-model="uploadFile"
        placeholder="Choose a file or drop it here..."
        drop-placeholder="Drop file here..."
      ></b-form-file
    ></b-modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import qdLogo from "./assets/qdLogo.svg";
import LinkPanel from "./components/LinkPanel.vue";
import { exportConfig, readFile } from "./utility";

@Component({
  components: {
    LinkPanel,
    qdLogo
  }
})
export default class App extends Vue {
  uploadFile: File | null = null;

  public showUpload() {
    this.$bvModal.show("upload-modal");
  }

  get dispColumns() {
    return this.$store.getters.numberOfColumns;
  }

  set dispColumns(colValue) {
    this.$store.commit("setNumberOfColumns", colValue);
  }

  async importFullConfig() {
    try {
      const importData = await readFile(this.uploadFile as File);
      this.$store.commit("importConfig", importData);
    } catch (err) {
      this.$bvModal.msgBoxOk(String(err), {
        title: "Import Error",
        okVariant: "danger"
      });
    }
  }

  exportFullConfig() {
    exportConfig(
      "QuickDashConfig",
      ".QDconfig",
      this.$store.getters.exportData
    );
  }
}
</script>
