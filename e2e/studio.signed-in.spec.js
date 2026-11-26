import { expect, test } from "@playwright/test";

test("a normal user gets a 403 in the studio", async ({ page }) => {
  await page.goto("/studio");
  await expect(page.getByRole("heading", { name: "403: not allowed" })).toBeVisible();
});
