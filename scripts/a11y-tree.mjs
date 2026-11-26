// Prints the accessibility tree of a page
import { chromium } from "@playwright/test";

const base = process.env.BASE_URL ?? "http://localhost:3000";
const path = process.argv[2] ?? "/";

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(`${base}${path}`, { waitUntil: "networkidle" });
console.log(await page.locator("body").ariaSnapshot());
await browser.close();
