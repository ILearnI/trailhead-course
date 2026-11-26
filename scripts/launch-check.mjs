// Checks the public pages
// against the launch targets
import { chromium } from "@playwright/test";

const base = process.env.BASE_URL ?? "http://localhost:3000";
const site = process.env.SITE_URL ?? "https://trailhead.example";
const paths = [
  "/", "/about", "/contact", "/faq",
  "/privacy", "/terms", "/trails", "/fr/trails",
];

// The sitemap tells search engines
// which pages exist
const sitemap = await (await fetch(`${base}/sitemap.xml`)).text();

const browser = await chromium.launch();
// Test certificate: accepted here only
const local = base.startsWith("https://localhost");
const context = await browser.newContext({ ignoreHTTPSErrors: local });
const page = await context.newPage();
const found = [];

for (const path of paths) {
  await page.goto(`${base}${path}`, { waitUntil: "networkidle" });
  const info = await page.evaluate(() => {
    const meta = (name) => document.querySelector(`meta[${name}]`)?.content;
    const fields = [...document.querySelectorAll("input, select, textarea")];
    const labeled = (field) => field.labels?.length || field.ariaLabel;
    return {
      title: document.title,
      description: meta('name="description"') ?? "",
      canonical: document.querySelector('link[rel="canonical"]')?.href,
      image: meta('property="og:image"'),
      headings: document.querySelectorAll("h1").length,
      unlabeled: fields.filter((f) => f.type !== "hidden" && !labeled(f)).length,
      alternates: document.querySelectorAll('link[rel="alternate"][hreflang]').length,
      data: [...document.querySelectorAll('script[type="application/ld+json"]')].map(
        (script) => JSON.parse(script.textContent)["@type"],
      ),
    };
  });
  found.push({ path, ...info });
}
await browser.close();

// A title or a description belongs to one page only
const count = (key, value) => found.filter((item) => item[key] === value).length;
const wanted = { "/": "WebSite", "/faq": "FAQPage" };

let failed = 0;
for (const item of found) {
  const problems = [];
  const length = item.description.length;
  if (count("title", item.title) > 1) problems.push("title is shared");
  if (length < 50 || length > 160) problems.push("description length");
  if (count("description", item.description) > 1) problems.push("description is shared");
  if (!item.canonical) problems.push("no canonical");
  if (!item.image) problems.push("no share image");
  if (item.headings !== 1) problems.push("h1 count");
  if (item.unlabeled > 0) problems.push(`${item.unlabeled} unlabeled fields`);
  const url = `${site}${item.path === "/" ? "" : item.path}<`;
  if (!sitemap.includes(url)) problems.push("not in the sitemap");
  if (wanted[item.path] && !item.data.includes(wanted[item.path])) {
    problems.push(`no ${wanted[item.path]} data`);
  }
  if (item.path.startsWith("/fr") && item.alternates === 0) {
    problems.push("no hreflang links");
  }
  if (problems.length > 0) failed += 1;
  console.log(`${problems.length ? "✗" : "✓"} ${item.path} ${problems.join(", ")}`);
}
console.log(`${failed} of ${found.length} pages need work`);
process.exitCode = failed > 0 ? 1 : 0;
