// Lists the images and the fonts that a page loads
import { chromium } from "@playwright/test";

const base = process.env.BASE_URL ?? "http://localhost:3000";
const path = process.argv[2] ?? "/";
const kb = (bytes) => Math.round(bytes / 1024);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

// Keep the size of every image and font
const sizes = new Map();
page.on("response", async (res) => {
  const type = res.request().resourceType();
  if (type === "image" || type === "font") {
    sizes.set(res.url(), (await res.body()).length);
  }
});
await page.goto(`${base}${path}`, { waitUntil: "networkidle" });

// What the browser shows, and what it downloaded
const images = await page.evaluate(() =>
  [...document.images].map((img) => ({
    name: img.alt.slice(0, 20),
    url: img.currentSrc,
    shown: img.clientWidth,
    natural: img.naturalWidth,
    sized: img.hasAttribute("width") && img.hasAttribute("height"),
    priority: img.fetchPriority === "high",
  })),
);
console.log(`images on ${path} (phone)`);
for (const img of images) {
  const wider = (img.natural / img.shown).toFixed(1);
  const flags = [!img.sized && "no size", !img.priority && "no priority"];
  console.log(`  ${img.name.padEnd(20)} ${kb(sizes.get(img.url))} KB`);
  console.log(`    ${wider}x wider than shown ${flags.filter(Boolean).join(", ")}`);
}

// The font files, and which ones are preloaded
const preloaded = await page.evaluate(() =>
  [...document.querySelectorAll('link[rel="preload"][as="font"]')].map(
    (link) => link.href,
  ),
);
console.log("fonts");
for (const [url, bytes] of sizes) {
  if (!/\.woff2?$/.test(url)) continue;
  const early = preloaded.includes(url) ? "preloaded" : "on demand";
  const name = url.split("/").pop().slice(0, 24);
  console.log(`  ${String(kb(bytes)).padStart(3)} KB  ${name}  ${early}`);
}
await browser.close();
