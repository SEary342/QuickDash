<template>
  <div id="app">
    <b-navbar variant="light" fluid
      ><b-navbar-brand fluid
        ><b-img fluid :src="require('./assets/favicon-32x32.png')"></b-img>
        QuickDash</b-navbar-brand
      ></b-navbar
    >
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
export default class App extends Vue {}
</script>
