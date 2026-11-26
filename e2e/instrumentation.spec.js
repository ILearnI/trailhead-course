import { expect, test } from "@playwright/test";

const marks = (page) =>
  page.evaluate(() => performance.getEntriesByType("mark").map((mark) => mark.name));

test("the client instrumentation runs before the app", async ({ page }) => {
  await page.goto("/");
  expect(await marks(page)).toContain("trailhead:boot");
});

test("it marks a client navigation", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Trails" }).first().click();
  await page.waitForURL(/trails/);
  expect(await marks(page)).toContain("trailhead:navigate:push");
});
