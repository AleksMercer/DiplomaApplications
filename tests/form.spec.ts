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

test("Form: primary metric to CSV", async ({ page }) => {
  page.on("dialog", async (d) => {
    try {
      await d.dismiss();
    } catch {}
  });

  await page.goto("/form");
  await page.waitForFunction(() => Boolean((window as any).__metrics));

  const country = page.locator('[data-testid="country-select"]');
  await expect(country).toBeVisible();
  await country.click();
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await page.waitForTimeout(700);

  const city = page.locator('[data-testid="city-select"]');
  await expect(city).toBeEnabled({ timeout: 5000 });
  await city.click();
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");

  const name = page.locator('[data-testid="name-input"]');
  const email = page.locator('[data-testid="email-input"]');
  const phone = page.locator('[data-testid="phone-input"]');

  await name.click();
  await page.keyboard.type(" ", { delay: 20 });
  await page.locator("body").click();

  await email.click();
  await page.keyboard.type("not-an-email", { delay: 10 });
  await page.locator("body").click();

  await phone.click();
  await page.keyboard.type("12345", { delay: 10 });
  await page.locator("body").click();

  await page.locator('[data-testid="submit-button"]').click();
  await page.waitForTimeout(300);

  const metrics = await page.evaluate(async () => {
    return await (window as any).__metrics?.finalize();
  });

  await appendToCsv(test.info(), metrics);
  console.log(
    `${frameworkShort(test.info().project.name)}: Test Form завершен`,
  );
});
