import { expect, test } from "./fixtures";

test("the login page looks the same", async ({ page }) => {
  await page.goto("/login");
  await expect(page).toHaveScreenshot("login.png");
});

test("a trail card looks the same", async ({ page }) => {
  await page.goto("/trails", { waitUntil: "networkidle" });
  const card = page.getByRole("listitem").filter({ hasText: "Cedar Falls" });
  await expect(card).toHaveScreenshot("card.png");
});

test("the trails page looks the same", async ({ page }) => {
  await page.goto("/trails", { waitUntil: "networkidle" });
  await expect(page).toHaveScreenshot("trails.png", {
    // The time changes at every visit
    mask: [page.getByText(/Opened at/)],
  });
});
