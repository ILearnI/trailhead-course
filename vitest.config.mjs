import { configDefaults, defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

export default defineConfig({
  // JSX and React transforms
  plugins: [react()],
  // Our .js components contain JSX
  oxc: { lang: "jsx" },
  resolve: {
    // Same @ alias as the app
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    // A fake browser for components
    environment: "jsdom",
    // A secret for the tests: never the real one
    env: { SESSION_SECRET: "test-secret-0123456789abcdef0123456789" },
    // Jest has its own files
    exclude: [...configDefaults.exclude, "**/*.jest.test.js", "e2e/**"],
    // Report the coverage of our own code
    coverage: {
      provider: "v8",
      include: ["src/lib/**"],
      exclude: [
        "**/*.test.*",
        // Data and a server-only module
        "src/lib/blur.js",
        "src/lib/weather.js",
        // They need a server or a browser:
        // e2e covers them
        "src/lib/api.js",
        "src/lib/dictionaries.js",
        "src/lib/og-card.js",
        // Demos from earlier chapters
        "src/lib/{burn,cms,counts,failing,legacy-stats}.js",
        "src/lib/{personal,profile,request-info,scopes,spots,stats}.js",
      ],
      // A table for people, a folder for a browser,
      // a file for CI
      reporter: ["text", "html", "lcov", "json-summary"],
      thresholds: { lines: 90, branches: 80, functions: 90, statements: 90 },
    },
    // Runs before every test file
    setupFiles: ["./vitest.setup.js"],
  },
});
