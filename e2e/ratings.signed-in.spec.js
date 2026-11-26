import { expect, test } from "./fixtures";

test("a new review changes the summary", async ({ page, request }) => {
  const ratings = page.getByRole("region", { name: "Ratings" });
  const created = await request.post("/api/trails/salt-marsh/reviews", {
    data: { rating: 2, text: "Bring a coat, the wind is cold." },
  });
  expect(created.status()).toBe(201);

  // The page is cached: it catches up
  // after a moment
  await expect(async () => {
    await page.goto("/trails/salt-marsh");
    const row = ratings.getByRole("listitem").filter({ hasText: "2 stars" });
    await expect(row).toContainText("1");
  }).toPass({ timeout: 20_000 });
});
