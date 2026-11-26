import { expect, test } from "@playwright/test";

test("an uncaught error in the page is reported", async ({ page }) => {
  const reports = [];
  await page.route("**/api/errors", (route) => {
    reports.push(JSON.parse(route.request().postData()));
    return route.fulfill({ status: 204 });
  });
  await page.goto("/");
  await page.evaluate(() => {
    setTimeout(() => {
      throw new Error("Boom from the test");
    });
  });
  await expect.poll(() => reports.length).toBe(1);
  expect(reports[0].message).toContain("Boom from the test");
  expect(reports[0].url).toBe("/");
});
