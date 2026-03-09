import { test, expect } from "./scripts/throttle";
import { appendToCsv } from "./scripts/csv";

async function smoothScroll(
  page: import("@playwright/test").Page,
  distance = 1000,
  step = 50,
) {
  await page.evaluate(
    async ({ distance, step }) => {
      const raf = () =>
        new Promise<void>((r) => requestAnimationFrame(() => r()));
      for (let y = 0; y <= distance; y += step) {
        window.scrollTo(0, y);
        await raf();
      }
      await new Promise((r) => setTimeout(r, 200));
      for (let y = distance; y >= 0; y -= step) {
        window.scrollTo(0, y);
        await raf();
      }
    },
    { distance, step },
  );
}

function frameworkShort(projectName: string) {
  const p = projectName.toLowerCase();
  if (p.includes("vue")) return "Vue";
  if (p.includes("react")) return "React";
  if (p.includes("svelte")) return "Svelte";
  if (p.includes("vanilla")) return "Vanilla";
  return "Unknown";
}

test("Filter: primary metric to CSV", async ({ page }) => {
  await page.goto("/filter");
  await page.waitForFunction(() => Boolean((window as any).__metrics));
  await expect(page.locator('[data-testid="search"]')).toBeVisible();

  await smoothScroll(page, 1000, 50);

  const search = page.locator('[data-testid="search"]');
  await search.click();
  await page.keyboard.type("homemade", { delay: 20 });
  await page.waitForTimeout(400);

  const categorySelect = page.locator('[data-testid="category-select"]');
  await categorySelect.click();
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");

  const sortSelect = page.locator('[data-testid="sort-select"]');
  await sortSelect.click();
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await page.waitForTimeout(200);

  const loadMore = page.locator('[data-testid="load-more"]');
  await loadMore.click();
  await expect(loadMore).toBeDisabled({ timeout: 2000 });
  await expect(loadMore).toBeEnabled({ timeout: 5000 });

  const metrics = await page.evaluate(async () => {
    return await (window as any).__metrics?.finalize();
  });

  await appendToCsv(test.info(), metrics);
  console.log(
    `${frameworkShort(test.info().project.name)}: Test Filter завершен`,
  );
});
