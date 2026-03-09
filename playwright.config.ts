import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  workers: 1,
  reporter: "dot",
  use: { baseURL: "http://localhost:5173", trace: "off" },
  webServer: [
    {
      command:
        "cd vue-app && npm run build && npm run preview -- --port=5173 --strictPort",
      url: "http://localhost:5173",
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
    {
      command:
        "cd react-app && npm run build && npm run preview -- --port=5174 --strictPort",
      url: "http://localhost:5174",
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
    {
      command:
        "cd svelte-app && npm run build && npm run preview -- --port=5175 --strictPort",
      url: "http://localhost:5175",
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
    {
      command:
        "cd vanilla-app && npm run build && npm run preview -- --port=5176 --strictPort",
      url: "http://localhost:5176",
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  ],
  projects: [
    {
      name: "vue-chromium",
      use: { ...devices["Desktop Chrome"], baseURL: "http://localhost:5173" },
    },
    {
      name: "react-chromium",
      use: { ...devices["Desktop Chrome"], baseURL: "http://localhost:5174" },
    },
    {
      name: "svelte-chromium",
      use: { ...devices["Desktop Chrome"], baseURL: "http://localhost:5175" },
    },
    {
      name: "vanilla-chromium",
      use: { ...devices["Desktop Chrome"], baseURL: "http://localhost:5176" },
    },
  ],
});
