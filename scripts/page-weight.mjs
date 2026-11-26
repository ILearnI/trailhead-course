// Lists the javascript that a page downloads
import { chromium } from "@playwright/test";

const base = process.env.BASE_URL ?? "http://localhost:3000";
const path = process.argv[2] ?? "/";
const budget = Number(process.argv[3] ?? Infinity);
const clickAt = process.argv.indexOf("--click");
const clickText = clickAt > 0 ? process.argv[clickAt + 1] : undefined;

const browser = await chromium.launch();
const page = await browser.newPage();
const files = [];

page.on("response", async (response) => {
  const url = response.url();
  if (!url.endsWith(".js") && !url.includes(".js?")) return;
  const size = (await response.body()).length;
  files.push({ name: new URL(url).pathname.split("/").pop(), size });
});

await page.goto(`${base}${path}`, { waitUntil: "networkidle" });
// What came with the load, before any click
const loaded = files.slice();
if (clickText) {
  await page.getByRole("button", { name: clickText }).click();
  await page.waitForLoadState("networkidle");
}
await browser.close();

files.sort((a, b) => b.size - a.size);
for (const file of files.slice(0, 6)) {
  const kb = String(Math.round(file.size / 1024)).padStart(5);
  console.log(`${kb} KB  ${file.name}`);
}
const sum = (list) => list.reduce((n, file) => n + file.size, 0) / 1024;
const total = sum(loaded);
const pad = (value) => String(Math.round(value)).padStart(5);
console.log(`${pad(total)} KB  total at load, ${loaded.length} files`);
if (clickText) console.log(`${pad(sum(files))} KB  total after the click`);

if (total > budget) {
  console.log(`Over the budget of ${budget} KB`);
  process.exit(1);
}
