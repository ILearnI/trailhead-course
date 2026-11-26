// Finds text that is hard to read, in both themes
import { chromium } from "@playwright/test";

const base = process.env.BASE_URL ?? "http://localhost:3000";
const pages = ["/en/trails", "/trails/alpine-lake", "/login"];

const browser = await chromium.launch();
const page = await browser.newPage();
let failures = 0;

for (const theme of ["light", "dark"]) {
  for (const path of pages) {
    await page.goto(`${base}${path}`, { waitUntil: "networkidle" });
    const set = (value) => (document.documentElement.dataset.theme = value);
    await page.evaluate(set, theme);
    const found = await page.evaluate(() => {
      // Any css color, as numbers
      const canvas = document.createElement("canvas").getContext("2d", {
        willReadFrequently: true,
      });
      const rgb = (color) => {
        canvas.clearRect(0, 0, 1, 1);
        canvas.fillStyle = color;
        canvas.fillRect(0, 0, 1, 1);
        return [...canvas.getImageData(0, 0, 1, 1).data];
      };
      const light = (c) => {
        const [r, g, b] = c.slice(0, 3).map((v) => v / 255).map((v) =>
          v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4,
        );
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
      };
      // First solid background, going up
      const background = (el) => {
        for (let node = el; node; node = node.parentElement) {
          const c = rgb(getComputedStyle(node).backgroundColor);
          if (c[3] === 255) return c;
        }
        return [255, 255, 255, 255];
      };
      const bad = new Map();
      for (const el of document.querySelectorAll("body *")) {
        const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
        if (!own) continue;
        const style = getComputedStyle(el);
        const fg = rgb(style.color);
        const bg = background(el);
        const [a, b] = [light(fg), light(bg)].sort((x, y) => y - x);
        const ratio = (a + 0.05) / (b + 0.05);
        const size = parseFloat(style.fontSize);
        const large = size >= 24 || (size >= 18.66 && Number(style.fontWeight) >= 700);
        if (ratio < (large ? 3 : 4.5)) {
          const key = `${fg.slice(0, 3)} on ${bg.slice(0, 3)}`;
          const text = el.textContent.trim().slice(0, 30);
          if (!bad.has(key)) bad.set(key, { ratio: ratio.toFixed(2), text });
        }
      }
      return [...bad.entries()];
    });
    for (const [colors, item] of found) {
      console.log(`LOW ${item.ratio} ${theme} ${path} [${colors}] "${item.text}"`);
      failures += 1;
    }
  }
}

await browser.close();
console.log(failures ? `${failures} problem(s)` : "all text is readable");
process.exit(failures ? 1 : 0);
