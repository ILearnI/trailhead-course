// Types in the first text box of a page,
// and reports the INP
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const base = process.env.BASE_URL ?? "http://localhost:3000";
const path = process.argv[2] ?? "/";
const text = process.argv[3] ?? "granite";

const dist = "../node_modules/web-vitals/dist/web-vitals.iife.js";
const library = readFileSync(fileURLToPath(new URL(dist, import.meta.url)), "utf8");

const browser = await chromium.launch();
const page = await browser.newPage();

// A phone: a slower processor
const session = await page.context().newCDPSession(page);
await session.send("Emulation.setCPUThrottlingRate", { rate: 4 });

await page.addInitScript({ content: `${library}\nwindow.webVitals = webVitals;` });
await page.addInitScript(() => {
  window.inp = 0;
  const keep = (metric) => (window.inp = metric.value);
  window.webVitals.onINP(keep, { reportAllChanges: true });
});

await page.goto(`${base}${path}`, { waitUntil: "networkidle" });
await page.getByRole("textbox").first().pressSequentially(text, { delay: 120 });
await page.waitForTimeout(500);

const inp = await page.evaluate(() => window.inp);
console.log(`${path}: typed ${text.length} letters`);
console.log(`  INP ${Math.round(inp)} ms`);
await browser.close();
