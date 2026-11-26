import { expect, test } from "./fixtures";

test("the live count of a trail follows a new review", async ({ page, request }) => {
  await page.goto("/trails/pine-hollow");
  const line = page.getByText(/Live: \d+ reviews/);
  await expect(line).toBeVisible();
  const before = Number((await line.innerText()).match(/\d+/)[0]);

  const created = await request.post("/api/trails/pine-hollow/reviews", {
    data: { rating: 4, text: "Quiet, and good for kids." },
  });
  expect(created.status()).toBe(201);

  // The server pushes the change
  await expect(async () => {
    const text = await line.innerText();
    expect(Number(text.match(/\d+/)[0])).toBeGreaterThan(before);
  }).toPass({ timeout: 3000 });
});
