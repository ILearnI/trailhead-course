import { expect, test } from "./fixtures";

test("a review sent to the API shows on my page", async ({ request, page }) => {
  const created = await request.post("/api/trails/alpine-lake/reviews", {
    data: { rating: 5, text: "Quiet and clear in the morning." },
  });
  expect(created.status()).toBe(201);

  await page.goto("/account/reviews");
  await expect(page.getByText("Quiet and clear in the morning.")).toBeVisible();
});

test("a short review is refused", async ({ request }) => {
  const response = await request.post("/api/trails/alpine-lake/reviews", {
    data: { rating: 5, text: "Nice" },
  });
  expect(response.status()).toBe(400);
  const body = await response.json();
  expect(body.errors.text).toBeDefined();
});
