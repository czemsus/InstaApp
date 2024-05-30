import "./styles/main.css";
import "@fortawesome/fontawesome-free/css/all.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store/store";

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import PrimeVue from "primevue/config";

library.add(fas, far);

const app = createApp(App);

app.component("font-awesome-icon", FontAwesomeIcon);

app.use(router);
app.use(store);
app.use(PrimeVue);

app.mount("#app");
