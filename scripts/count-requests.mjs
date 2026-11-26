// Counts the requests that a page sends
// to a path, while it stays open
import { chromium } from "@playwright/test";

const base = process.env.BASE_URL ?? "http://localhost:3000";
const [path, match, seconds = "12"] = process.argv.slice(2);

const browser = await chromium.launch();
const page = await browser.newPage();
let count = 0;
page.on("request", (request) => {
  if (request.url().includes(match)) count += 1;
});

await page.goto(`${base}${path}`, { waitUntil: "networkidle" });
await page.waitForTimeout(Number(seconds) * 1000);
console.log(`${count} requests to ${match} in ${seconds} s`);
await browser.close();
