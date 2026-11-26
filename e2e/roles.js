import { setRole } from "./db";

// Sign up with a role, log in, open the studio
export async function openStudioAs(role, { page, signupPage, loginPage, user }) {
  await signupPage.signUp(user);
  setRole(user.email, role);
  await loginPage.logIn(user);
  await page.waitForURL("/account");
  await page.goto("/studio");
}
