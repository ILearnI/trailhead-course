import { expect, test } from "@playwright/test";

test("the home page has its own title", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("Trail guides and reviews | Trailhead");
});

test("the trails page lists the trails", async ({ page }) => {
  await page.goto("/trails");
  await expect(page.getByRole("heading", { name: "All trails" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Alpine Lake Loop" })).toBeVisible();
});
