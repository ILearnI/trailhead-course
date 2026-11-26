import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "./fixtures";

const pages = [
  "/", "/about", "/contact", "/faq",
  "/trails", "/trails/alpine-lake", "/login", "/signup",
  "/trails/cedar-falls/reviews",
];

for (const path of pages) {
  test(`${path} has no accessibility violations`, async ({ page }) => {
    // Wait until the page has stopped moving
    await page.goto(path, { waitUntil: "networkidle" });
    const results = await new AxeBuilder({ page })
      // Layouts demo: two copies, one name
      .exclude('aside[aria-label="Page details"]')
      .analyze();
    const found = results.violations.map((v) => `${v.id} (${v.nodes.length})`);
    expect(found).toEqual([]);
  });
}
