import { onCLS, onFCP, onINP, onLCP, type Metric } from "web-vitals";

type LongTaskInfo = { startTime: number; duration: number };

export type MetricsData = {
  lcp: number | null;
  inp: number | null;
  cls: number;
  fcp: number | null;
  tbt: number;
  longTasks: { count: number; sum: number };
  memory: { jsHeapUsed: number | null };
  jsWeight?: number | null;
  ready: boolean;
  page: string | null;
};

declare global {
  interface Window {
    __metrics?: {
      data: MetricsData;
      setPage: (name: string) => void;
      finalize: () => Promise<MetricsData>;
      get: () => MetricsData;
      _initialized?: boolean;
    };
  }
}

export function initMetrics() {
  if (typeof window === "undefined") return;
  if (window.__metrics?._initialized) return;

  const data: MetricsData = {
    lcp: null,
    inp: null,
    cls: 0,
    fcp: null,
    tbt: 0,
    longTasks: { count: 0, sum: 0 },
    memory: { jsHeapUsed: null },
    jsWeight: null,
    ready: false,
    page: null,
  };

  const state = {
    longTasks: [] as LongTaskInfo[],
    fcpTime: 0,
    finalized: false,
  };

  onLCP(
    (m: Metric) => {
      data.lcp = m.value;
    },
    { reportAllChanges: true },
  );

  onINP(
    (m: Metric) => {
      data.inp = m.value;
    },
    { reportAllChanges: true },
  );

  onCLS(
    (m: Metric) => {
      data.cls = m.value;
    },
    { reportAllChanges: true },
  );

  onFCP((m: Metric) => {
    data.fcp = m.value;
    state.fcpTime = typeof m.value === "number" ? m.value : 0;
  });

  try {
    const po = new PerformanceObserver((list) => {
      for (const e of list.getEntries()) {
        const duration = e.duration || 0;
        if (duration > 0) {
          state.longTasks.push({ startTime: e.startTime, duration });
        }
      }
    });
    po.observe({ type: "longtask", buffered: true });
  } catch {}

  function computeJsWeight(): number | null {
    try {
      const entries = performance.getEntriesByType(
        "resource",
      ) as PerformanceResourceTiming[];
      const scripts = entries.filter((e) => e.initiatorType === "script");
      const sum = scripts.reduce((acc, e) => acc + (e.encodedBodySize || 0), 0);
      return sum || null;
    } catch {
      return null;
    }
  }

  async function computeMemory(): Promise<number | null> {
    try {
      const perfAny = performance as any;
      if (typeof perfAny.measureUserAgentSpecificMemory === "function") {
        const result = await perfAny.measureUserAgentSpecificMemory();
        return result && typeof result.bytes === "number" ? result.bytes : null;
      }
      if (perfAny.memory && typeof perfAny.memory.usedJSHeapSize === "number") {
        return perfAny.memory.usedJSHeapSize;
      }
      return null;
    } catch {
      return null;
    }
  }

  async function finalize(): Promise<MetricsData> {
    if (state.finalized) return data;
    state.finalized = true;

    await new Promise((r) => requestAnimationFrame(() => r(null)));

    const fcpStart = state.fcpTime || 0;
    const windowTasks =
      fcpStart > 0
        ? state.longTasks.filter((t) => t.startTime >= fcpStart)
        : [...state.longTasks];

    const longSum = windowTasks.reduce((acc, t) => acc + t.duration, 0);
    const tbt = windowTasks.reduce((acc, t) => {
      const over = t.duration - 50;
      return acc + (over > 0 ? over : 0);
    }, 0);

    data.longTasks = { count: windowTasks.length, sum: Math.round(longSum) };
    data.tbt = Math.round(tbt);
    data.memory.jsHeapUsed = await computeMemory();

    if (data.jsWeight == null) {
      data.jsWeight = computeJsWeight();
    }

    data.ready = true;
    return data;
  }

  function setPage(name: string) {
    data.page = name;
  }

  function get(): MetricsData {
    return data;
  }

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      finalize();
    }
  });

  window.__metrics = {
    data,
    setPage,
    finalize,
    get,
    _initialized: true,
  };
}
