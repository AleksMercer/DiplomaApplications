import type { TestInfo } from "@playwright/test";
import { promises as fs } from "fs";
import path from "path";

function frameworkShort(projectName: string) {
  const p = projectName.toLowerCase();
  if (p.includes("vue")) return "Vue";
  if (p.includes("react")) return "React";
  if (p.includes("svelte")) return "Svelte";
  if (p.includes("vanilla")) return "Vanilla";
  return "Unknown";
}

function normalizePage(name: any) {
  const s = String(name || "").toLowerCase();
  if (s.includes("load")) return "Load";
  if (s.includes("filter")) return "Filter";
  if (s.includes("form")) return "Form";
  return "Unknown";
}

const isNum = (v: any): v is number =>
  typeof v === "number" && Number.isFinite(v);
const r = (v: any) => (isNum(v) ? Math.round(v) : null);

type Entry = { label: string; value: number | null };

function buildEntries(page: string, m: any): Entry[] {
  const heap = m?.memory?.jsHeapUsed ?? null;
  const lcnt = m?.longTasks?.count ?? null;
  const lsum = m?.longTasks?.sum ?? null;

  if (page === "Load") {
    return [
      { label: "LCP ms", value: r(m?.lcp) },
      { label: "FCP ms", value: r(m?.fcp) },
      { label: "JSHeapUsed B", value: isNum(heap) ? heap : null },
      { label: "JSWeight B", value: isNum(m?.jsWeight) ? m.jsWeight : null },
    ];
  }

  if (page === "Filter") {
    return [
      { label: "LCP ms", value: r(m?.lcp) },
      { label: "FCP ms", value: r(m?.fcp) },
      { label: "INP ms", value: r(m?.inp) },
      { label: "TBT ms", value: r(m?.tbt) },
      { label: "LongTasks sum ms", value: r(lsum) },
      { label: "LongTasks count", value: isNum(lcnt) ? lcnt : null },
      { label: "JSHeapUsed B", value: isNum(heap) ? heap : null },
      { label: "JSWeight B", value: isNum(m?.jsWeight) ? m.jsWeight : null },
    ];
  }

  if (page === "Form") {
    return [
      { label: "LCP ms", value: r(m?.lcp) },
      { label: "INP ms", value: r(m?.inp) },
      { label: "CLS", value: isNum(m?.cls) ? m.cls : null },
      { label: "FCP ms", value: r(m?.fcp) },
      { label: "TBT ms", value: r(m?.tbt) },
      { label: "LongTasks sum ms", value: r(lsum) },
      { label: "LongTasks count", value: isNum(lcnt) ? lcnt : null },
      { label: "JSHeapUsed B", value: isNum(heap) ? heap : null },
      { label: "JSWeight B", value: isNum(m?.jsWeight) ? m.jsWeight : null },
    ];
  }

  return [
    { label: "LCP ms", value: r(m?.lcp) },
    { label: "INP ms", value: r(m?.inp) },
    { label: "CLS", value: isNum(m?.cls) ? m.cls : null },
    { label: "FCP ms", value: r(m?.fcp) },
    { label: "TBT ms", value: r(m?.tbt) },
    { label: "LongTasks sum ms", value: r(lsum) },
    { label: "LongTasks count", value: isNum(lcnt) ? lcnt : null },
    { label: "JSHeapUsed B", value: isNum(heap) ? heap : null },
    { label: "JSWeight B", value: isNum(m?.jsWeight) ? m.jsWeight : null },
  ];
}

export async function appendToCsv(testInfo: TestInfo, metrics: any) {
  const fw = frameworkShort(testInfo.project.name);
  const page = normalizePage(metrics?.page ?? testInfo.title);
  const entries = buildEntries(page, metrics).filter((e) => e.value !== null);

  if (entries.length === 0) return;

  const dir = path.resolve(process.cwd(), "metrics");
  const file = path.join(dir, "metrics.csv");
  await fs.mkdir(dir, { recursive: true });

  let lines: string[] = [];
  try {
    const content = await fs.readFile(file, "utf-8");
    lines = content.split(/\r?\n/).filter(Boolean);
  } catch {}

  const upsert = (key: string, val: number) => {
    const idx = lines.findIndex((l) => l.startsWith(key));
    if (idx >= 0) lines[idx] = `${lines[idx]},${val}`;
    else lines.push(`${key}${val}`);
  };

  for (const { label, value } of entries) {
    const key = `${fw}:${page}:${label}:`;
    upsert(key, value as number);
  }

  await fs.writeFile(file, lines.join("\n") + "\n", "utf-8");
}
