import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./style.css";
import { initMetrics } from "@shared/metrics";

initMetrics();

createApp(App).use(router).mount("#app");
