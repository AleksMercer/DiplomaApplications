import { test as base } from "@playwright/test";

export const test = base.extend({
  page: async ({ page, browserName }, use) => {
    if (browserName === "chromium") {
      const client = await page.context().newCDPSession(page);
      await client.send("Emulation.setCPUThrottlingRate", { rate: 6 });
      await client.send("Network.enable");
      await client.send("Network.emulateNetworkConditions", {
        offline: false,
        latency: 150,
        downloadThroughput: (1.5 * 1024 * 1024) / 8,
        uploadThroughput: (750 * 1024) / 8,
      });
    }
    await use(page);
  },
});
export const expect = base.expect;
