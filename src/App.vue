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
          <b-dropdown-item-button>Import</b-dropdown-item-button>
          <b-dropdown-item-button>Export</b-dropdown-item-button>
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
  get dispColumns() {
    return this.$store.getters.numberOfColumns;
  }

  set dispColumns(colValue) {
    this.$store.commit("setNumberOfColumns", colValue);
  }
}
</script>
