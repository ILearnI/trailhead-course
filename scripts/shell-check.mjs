// Does every page have a static shell?
import { readFileSync } from "node:fs";

const file = ".next/prerender-manifest.json";
const manifest = JSON.parse(readFileSync(file, "utf8"));

// Pages that wait for the server, and why
const MAY_WAIT = {
  "/account": "private: it reads the session first",
  "/admin": "private: instant checks are off",
  "/conditions": "a demo: it waits on purpose",
};

const pages = Object.entries(manifest.routes).filter(([path]) => !path.startsWith("/_"));
const waiting = pages.filter(([, page]) => page.response === "empty").map(([path]) => path);
const problems = waiting.filter((path) => !(path in MAY_WAIT));

console.log(`${pages.length} pages checked`);
for (const path of waiting.filter((path) => path in MAY_WAIT)) {
  console.log(`  waits, and may: ${path} (${MAY_WAIT[path]})`);
}
for (const path of problems) console.log(`  PROBLEM, no shell: ${path}`);
process.exit(problems.length > 0 ? 1 : 0);
