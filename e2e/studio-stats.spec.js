import { expect, test } from "./fixtures";
import { openStudioAs } from "./roles";

test("the overview counts a new review", async ({ page, signupPage, loginPage, user }) => {
  await openStudioAs("admin", { page, signupPage, loginPage, user });
  const card = page.getByRole("region", { name: "Reviews", exact: true });
  const before = Number(await card.locator("p").textContent());
  const body = { rating: 5, text: "A very good walk, once again." };
  const sent = await page.request.post("/api/trails/cedar-falls/reviews", { data: body });
  expect(sent.ok()).toBe(true);
  await expect
    .poll(async () => {
      await page.reload();
      return Number(await card.locator("p").textContent());
    })
    .toBe(before + 1);
});
