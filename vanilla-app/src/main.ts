import "./app.css";
import { initMetrics } from "@shared/metrics";
import { mount as mountLoad } from "./views/LoadView";
import { mount as mountFilter } from "./views/FilterView";
import { mount as mountForm } from "./views/FormView";

initMetrics();

const container = document.getElementById("app") as HTMLElement;

type Unmount = () => void;
let unmount: Unmount | null = null;

const routes: Record<string, (c: HTMLElement) => Unmount> = {
  "/load": mountLoad,
  "/filter": mountFilter,
  "/form": mountForm,
};

function setPageMetric(path: string) {
  const name =
    path === "/load"
      ? "Load"
      : path === "/filter"
        ? "Filter"
        : path === "/form"
          ? "Form"
          : path;
  (window as any).__metrics?.setPage?.(name);
}

function render(path: string) {
  const mount = routes[path] || routes["/load"];
  if (unmount) {
    try {
      unmount();
    } catch {}
  }
  setPageMetric(path);
  unmount = mount(container);
}

function navigate(path: string) {
  if (window.location.pathname === path) return;
  history.pushState({}, "", path);
  render(path);
}

document.addEventListener("click", (e) => {
  const a = (e.target as HTMLElement).closest(
    'a[href^="/"]',
  ) as HTMLAnchorElement | null;
  if (!a) return;
  e.preventDefault();
  navigate(a.getAttribute("href")!);
});

window.addEventListener("popstate", () => render(window.location.pathname));

if (window.location.pathname === "/") {
  history.replaceState({}, "", "/load");
}
render(window.location.pathname);
