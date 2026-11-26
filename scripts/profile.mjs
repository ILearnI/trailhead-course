// Clicks a button, and prints
// the React commits it caused
import { chromium } from "@playwright/test";

const base = process.env.BASE_URL ?? "http://localhost:3000";
const path = process.argv[2] ?? "/";
const label = process.argv[3] ?? "Recalculate";

const browser = await chromium.launch();
const page = await browser.newPage();

// A phone: a slower processor
const session = await page.context().newCDPSession(page);
await session.send("Emulation.setCPUThrottlingRate", { rate: 4 });

// Time from the click to the next frame
await page.addInitScript(() => {
  addEventListener("click", () => {
    const start = performance.now();
    requestAnimationFrame(() => {
      window.frameMs = performance.now() - start;
    });
  }, true);
});

await page.goto(`${base}${path}`, { waitUntil: "networkidle" });
await page.evaluate(() => (window.commits = []));
await page.getByRole("button", { name: label }).click();
await page.waitForTimeout(1000);

const { commits, frameMs } = await page.evaluate(() => ({
  commits: window.commits,
  frameMs: window.frameMs,
}));
console.log(`click on "${label}": next frame after ${Math.round(frameMs)} ms`);
for (const commit of commits) {
  console.log(`  ${commit.name} ${commit.phase}: ${commit.ms.toFixed(1)} ms`);
}
await browser.close();
