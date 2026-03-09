import { mount } from "svelte";
import "./app.css";
import App from "./App.svelte";
import { initMetrics } from "@shared/metrics";

initMetrics();
const app = mount(App, {
  target: document.getElementById("app")!,
});

export default app;
