import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30000,
  use: {
    baseURL: "http://127.0.0.1:5555",
  },
  webServer: {
    command: "npx vite --host 127.0.0.1 --port 5555",
    port: 5555,
    reuseExistingServer: !process.env.CI,
  },
});
