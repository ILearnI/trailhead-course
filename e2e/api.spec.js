import { expect, test } from "@playwright/test";

test("the trails API lists the trails", async ({ request }) => {
  const response = await request.get("/api/trails");
  await expect(response).toBeOK();
  const body = await response.json();
  expect(body.count).toBe(7);
  expect(body.items[0]).toHaveProperty("slug");
});

test("an unknown region is rejected", async ({ request }) => {
  const response = await request.get("/api/trails?region=moon");
  expect(response.status()).toBe(400);
  expect(await response.json()).toEqual({ error: "Unknown region" });
});

test("a review needs a session", async ({ request }) => {
  const response = await request.post("/api/trails/alpine-lake/reviews", {
    data: { rating: 5, text: "A fine walk by the lake." },
  });
  expect(response.status()).toBe(401);
});
