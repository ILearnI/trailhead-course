import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = defineConfig([
  ...nextVitals,
  {
    // The editor's iframe-script tag in layout.js is a plain <script>.
    rules: { "@next/next/no-sync-scripts": "off" },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "handbook/.next/**",
    "handbook/out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
