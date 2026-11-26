// Measures the Core Web Vitals of a page
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const base = process.env.BASE_URL ?? "http://localhost:3000";
const path = process.argv[2] ?? "/";
const mobile = process.argv.includes("--mobile");
const consent = process.argv.includes("--consent");
const detail = process.argv.includes("--detail");
const clickAt = process.argv.indexOf("--click");
const clickText = clickAt > 0 ? process.argv[clickAt + 1] : undefined;

// The browser version of the library, as text
const dist = "../node_modules/web-vitals/dist/web-vitals.attribution.iife.js";
const library = readFileSync(fileURLToPath(new URL(dist, import.meta.url)), "utf8");

const browser = await chromium.launch();
const page = await browser.newPage();

if (mobile) {
  // A phone: a slower processor, and a slow network
  const session = await page.context().newCDPSession(page);
  await session.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  await session.send("Network.emulateNetworkConditions", {
    offline: false,
    latency: 150,
    downloadThroughput: (1.6 * 1024 * 1024) / 8,
    uploadThroughput: (750 * 1024) / 8,
  });
}

if (consent) {
  // A visitor who agreed: the page reports
  const cookie = { name: "consent", value: "yes", url: base };
  await page.context().addCookies([cookie]);
}

// The library measures; we keep the latest
await page.addInitScript({ content: `${library}\nwindow.webVitals = webVitals;` });
await page.addInitScript(() => {
  window.vitals = {};
  window.details = {};
  const keep = (metric) => {
    window.vitals[metric.name] = metric.value;
    window.details[metric.name] = metric.attribution;
  };
  for (const name of ["onTTFB", "onFCP", "onLCP", "onCLS", "onINP"]) {
    window.webVitals[name](keep, { reportAllChanges: true });
  }
});

await page.goto(`${base}${path}`, { waitUntil: "networkidle" });
// A click: an interaction to measure
if (clickText) await page.getByRole("button", { name: clickText }).click();
else await page.mouse.click(5, 5);
await page.waitForTimeout(1000);
const vitals = await page.evaluate(() => window.vitals);
const details = await page.evaluate(() => JSON.parse(JSON.stringify(window.details)));

const ms = (value) => (value === undefined ? "none" : `${Math.round(value)} ms`);
console.log(`${path}${mobile ? " (mobile)" : ""}`);
console.log(`  TTFB ${ms(vitals.TTFB)}`);
console.log(`  FCP  ${ms(vitals.FCP)}`);
console.log(`  LCP  ${ms(vitals.LCP)}`);
console.log(`  INP  ${ms(vitals.INP)}`);
console.log(`  CLS  ${(vitals.CLS ?? 0).toFixed(3)}`);
const widget = await page.evaluate(
  () => performance.getEntriesByName("widget-loaded")[0]?.startTime,
);
if (widget) console.log(`  widget at ${ms(widget)}`);
if (detail) {
  const { LCP, CLS, INP } = details;
  console.log(`  LCP element ${LCP?.target}`);
  console.log(`  LCP download ${ms(LCP?.resourceLoadDuration)}`);
  console.log(`  CLS culprit ${CLS?.largestShiftTarget}`);
  console.log(`  INP target ${INP?.interactionTarget}`);
  console.log(`  INP handler ${ms(INP?.processingDuration)}`);
}
// Closing the page sends the final numbers
await page.close();
await new Promise((resolve) => setTimeout(resolve, 500));
await browser.close();
