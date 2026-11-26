import { expect, test } from "./fixtures";

test("a new visitor can sign up and log in", async ({
  signupPage,
  loginPage,
  accountPage,
  user,
}) => {
  await signupPage.signUp(user);
  await loginPage.logIn(user);
  await expect(accountPage.signedInAs(user.name)).toBeVisible();
});

test("a wrong password shows an error", async ({ signupPage, loginPage, user }) => {
  await signupPage.signUp(user);
  await loginPage.logIn({ ...user, password: "not-the-password" });
  await expect(loginPage.error).toHaveText("Wrong email or password");
});
