import { expect, test } from "./fixtures";
import { openStudioAs } from "./roles";

test.beforeEach(async ({ context }) => {
  const cookie = { name: "consent", value: "yes", url: "http://localhost:3000" };
  await context.addCookies([cookie]);
});

test("a moderator removes a review", async ({ page, signupPage, loginPage, user }) => {
  await openStudioAs("admin", { page, signupPage, loginPage, user });
  const text = `Moderation test ${user.email.split("@")[0]}`;
  const sent = await page.request.post("/api/trails/cedar-falls/reviews", {
    data: { rating: 3, text },
  });
  expect(sent.ok()).toBe(true);

  await page.goto("/studio/reviews");
  await expect(page.getByText(text)).toBeVisible();
  await page.getByRole("button", { name: `Remove: ${text}` }).click();
  await expect(page.getByText(text)).toHaveCount(0);
});

test("a normal user cannot moderate", async ({ page, signupPage, loginPage, user }) => {
  await signupPage.signUp(user);
  await loginPage.logIn(user);
  await page.waitForURL("/account");
  await page.goto("/studio/reviews");
  await expect(page.getByRole("heading", { name: "403: not allowed" })).toBeVisible();
});
