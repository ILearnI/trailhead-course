import { expect, test } from "./fixtures";
import { openStudioAs } from "./roles";

test("a visitor is sent to the login", async ({ page }) => {
  await page.goto("/studio");
  await expect(page).toHaveURL(/\/login\?next=%2Fstudio/);
});

test("an editor has no People link", async ({ page, signupPage, loginPage, user }) => {
  await openStudioAs("editor", { page, signupPage, loginPage, user });
  const menu = page.getByRole("navigation", { name: "Studio" });
  await expect(menu.getByRole("link", { name: "Trails" })).toBeVisible();
  await expect(menu.getByRole("link", { name: "People" })).toHaveCount(0);
});

test("an admin sees People too", async ({ page, signupPage, loginPage, user }) => {
  await openStudioAs("admin", { page, signupPage, loginPage, user });
  const menu = page.getByRole("navigation", { name: "Studio" });
  await expect(menu.getByRole("link", { name: "People" })).toBeVisible();
});

test("an editor cannot open People", async ({ page, signupPage, loginPage, user }) => {
  await openStudioAs("editor", { page, signupPage, loginPage, user });
  await page.goto("/studio/people");
  await expect(page.getByRole("heading", { name: "403: not allowed" })).toBeVisible();
});
