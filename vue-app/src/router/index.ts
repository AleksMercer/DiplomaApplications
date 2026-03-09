import { createRouter, createWebHistory } from "vue-router";
import LoadView from "../views/LoadView.vue";
import FilterView from "../views/FilterView.vue";
import FormView from "../views/FormView.vue";

const routes = [
  { path: "/", redirect: "/load" },
  { path: "/load", name: "Load", component: LoadView },
  { path: "/filter", name: "Filter", component: FilterView },
  { path: "/form", name: "Form", component: FormView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.afterEach((to) => {
  (window as any).__metrics?.setPage(String(to.name || to.path));
});

export default router;
