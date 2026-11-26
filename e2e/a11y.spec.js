import { expect, test } from "@playwright/test";

test("the site has a main navigation", async ({ page }) => {
  await page.goto("/trails");
  await expect(page.getByRole("navigation", { name: "Main" })).toBeVisible();
});

test("the first tab goes to a skip link", async ({ page }) => {
  await page.goto("/trails");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to content" });
  await expect(skip).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#content")).toBeFocused();
});

test("the fields of the login form have labels", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByLabel("Email")).toBeVisible();
  await expect(page.getByLabel("Password")).toBeVisible();
});

test("the focus is visible", async ({ page }) => {
  await page.goto("/trails");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  const outline = await page.evaluate(
    () => getComputedStyle(document.activeElement).outlineStyle,
  );
  expect(outline).not.toBe("none");
});
