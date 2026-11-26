import { test as base } from "@playwright/test";
import { AccountPage } from "./pages/account-page";
import { LoginPage } from "./pages/login-page";
import { ReviewsPage } from "./pages/reviews-page";
import { SignupPage } from "./pages/signup-page";

// Our own test: it brings a new user,
// with unique data
export const test = base.extend({
  signupPage: async ({ page }, provide) => {
    await provide(new SignupPage(page));
  },
  loginPage: async ({ page }, provide) => {
    await provide(new LoginPage(page));
  },
  accountPage: async ({ page }, provide) => {
    await provide(new AccountPage(page));
  },
  reviewsPage: async ({ page }, provide) => {
    await provide(new ReviewsPage(page));
  },
  user: async ({}, provide, testInfo) => {
    const id = `${testInfo.workerIndex}-${Date.now()}`;
    await provide({
      name: "Test User",
      email: `e2e-${id}@example.com`,
      password: "e2e-password-1",
    });
  },
});

export { expect } from "@playwright/test";
