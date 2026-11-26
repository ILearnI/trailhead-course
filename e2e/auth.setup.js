import { expect, test as setup } from "./fixtures";

const file = "e2e/.auth/user.json";

setup("sign up, log in, and keep the session", async ({
  page,
  signupPage,
  loginPage,
  user,
}) => {
  await signupPage.signUp(user);
  await loginPage.logIn(user);
  await expect(page).toHaveURL("/account");

  // Save the cookies, for the tests
  // that need a user
  await page.context().storageState({ path: file });
});
