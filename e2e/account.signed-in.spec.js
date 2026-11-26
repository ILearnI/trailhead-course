import { expect, test } from "./fixtures";

test("the account page greets the user", async ({ accountPage }) => {
  await accountPage.goto();
  await expect(accountPage.heading).toBeVisible();
  await expect(accountPage.signedInAs("Test User")).toBeVisible();
});

test("logging out goes back to the login page", async ({
  page,
  accountPage,
}) => {
  await accountPage.goto();
  await accountPage.logOut();
  await expect(page).toHaveURL(/\/login/);
});
