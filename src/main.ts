import Vue from "vue";
import { BootstrapVue } from "bootstrap-vue";
import { initialLoad, store } from "./store/store";
import App from "./App.vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

Vue.config.productionTip = false;

Vue.use(BootstrapVue);

initialLoad();

new Vue({
  components: { App },
  store,
  render: h => h(App)
}).$mount("#app");