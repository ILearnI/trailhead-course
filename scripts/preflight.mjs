// The launch checklist, run by a machine
import { spawnSync } from "node:child_process";

const base = process.env.BASE_URL ?? "http://localhost:3000";
const get = (path, options) => fetch(`${base}${path}`, options);
const status = async (path, options) => (await get(path, options)).status;
const json = async (path) => (await get(path)).json();
// Do not follow a redirect: look at it
const MANUAL = { redirect: "manual" };

// Run one of our checkers: did it exit with 0?
const passes = (script) => spawnSync("node", [script]).status === 0;

const checks = [
  ["Required variables are set", () => passes("scripts/check-env.mjs")],
  ["No secret in the browser files", () => passes("scripts/leak-check.mjs")],
  ["Every page has a shell, or a reason", () => passes("scripts/shell-check.mjs")],
  ["Search engine checks pass", () => passes("scripts/launch-check.mjs")],
  ["The health route says ok", async () => (await json("/api/health")).status === "ok"],
  ["The studio needs a login", async () => (await status("/studio", MANUAL)) === 307],
  ["The error list is private", async () => (await status("/api/errors")) === 401],
  [
    "Security headers are set",
    async () => {
      const headers = (await get("/")).headers;
      const strict = headers.get("x-content-type-options") === "nosniff";
      const secure = headers.has("strict-transport-security");
      const hidden = !headers.has("x-powered-by");
      return strict && secure && hidden;
    },
  ],
];

let failed = 0;
for (const [name, check] of checks) {
  const ok = await Promise.resolve(check()).catch(() => false);
  if (!ok) failed += 1;
  console.log(`${ok ? "✓" : "✗"} ${name}`);
}
console.log(`${checks.length - failed} of ${checks.length} checks passed`);
process.exit(failed > 0 ? 1 : 0);
