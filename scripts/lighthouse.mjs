// Runs Lighthouse on a page,
// and prints the median score
import { chromium } from "@playwright/test";
import { launch } from "chrome-launcher";
import lighthouse from "lighthouse";

const base = process.env.BASE_URL ?? "http://localhost:3000";
const path = process.argv[2] ?? "/";
const runs = Number(process.argv[3] ?? 3);
const median = (list) => [...list].sort((a, b) => a - b)[Math.floor(list.length / 2)];

// Our own Chromium, with no window
const chrome = await launch({
  chromePath: chromium.executablePath(),
  chromeFlags: ["--headless=new", "--no-sandbox"],
});
const options = {
  port: chrome.port,
  output: "json",
  logLevel: "error",
  onlyCategories: ["performance"],
};

// Several runs: one run alone is noisy
const scores = [];
let report;
for (let i = 0; i < runs; i++) {
  const run = await lighthouse(`${base}${path}`, options);
  report = run.lhr;
  scores.push(Math.round(report.categories.performance.score * 100));
}
await chrome.kill();

console.log(`${path}: performance ${median(scores)} (runs ${scores.join(", ")})`);
const metrics = [
  "largest-contentful-paint",
  "total-blocking-time",
  "cumulative-layout-shift",
];
for (const id of metrics) {
  console.log(`  ${report.audits[id].title}: ${report.audits[id].displayValue}`);
}

// The element that moved the most,
// if the page shifted
const shift = report.audits["layout-shifts"].details?.items?.[0];
if (shift?.score > 0) console.log(`  moved the most: ${shift.node.selector}`);
