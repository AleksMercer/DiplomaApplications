import { test, expect } from "./scripts/throttle";
import { appendToCsv } from "./scripts/csv";

function frameworkShort(projectName: string) {
  const p = projectName.toLowerCase();
  if (p.includes("vue")) return "Vue";
  if (p.includes("react")) return "React";
  if (p.includes("svelte")) return "Svelte";
  if (p.includes("vanilla")) return "Vanilla";
  return "Unknown";
}

test("Load: primary metric to CSV", async ({ page }) => {
  await page.goto("/load");
  await page.waitForFunction(() => Boolean((window as any).__metrics));
  await page.waitForLoadState("networkidle");
  await expect(page.locator("h1")).toBeVisible();
  await page
    .waitForFunction(
      () => {
        const m = (window as any).__metrics?.get?.();
        return m && m.lcp != null;
      },
      { timeout: 5000 },
    )
    .catch(() => {});

  const metrics = await page.evaluate(async () => {
    return await (window as any).__metrics?.finalize();
  });

  await appendToCsv(test.info(), metrics);
  console.log(
    `${frameworkShort(test.info().project.name)}: Test Load завершен`,
  );
});
