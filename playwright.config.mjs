import { defineConfig, devices } from "@playwright/test";

const desktop = devices["Desktop Chrome"];
const signedIn = /.*\.signed-in\.spec\.js/;
const setup = /.*\.setup\.js/;
const teardown = /.*\.teardown\.js/;
// Needs the dev server, for instant()
const devOnly = /loading\.spec\.js/;

export default defineConfig({
  testDir: "e2e",
  // Run the tests of a file in parallel too
  fullyParallel: true,
  // Settings for a continuous integration server
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  // A list in the terminal,
  // and a report to open later
  reporter: [["list"], ["html", { open: "never" }]],
  // Start the app, if it is not running
  webServer: {
    // In CI, the build. On a laptop, the dev server
    command: process.env.CI ? "npm start" : "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: true,
  },
  use: {
    baseURL: "http://localhost:3000",
    // Keep the trace of a test that fails
    trace: "retain-on-failure",
  },
  projects: [
    // Runs first: creates a user,
    // and saves the login
    { name: "setup", testMatch: setup, teardown: "cleanup" },
    // Runs last: removes the users of the tests
    { name: "cleanup", testMatch: teardown },
    {
      name: "chromium",
      use: { ...desktop },
      testIgnore: [setup, teardown, signedIn, devOnly],
      dependencies: ["setup"],
    },
    {
      name: "signed-in",
      use: { ...desktop, storageState: "e2e/.auth/user.json" },
      testMatch: signedIn,
      dependencies: ["setup"],
    },
  ],
});
