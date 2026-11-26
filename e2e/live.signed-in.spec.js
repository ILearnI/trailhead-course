import { expect, test } from "./fixtures";

test("the live count follows a new review", async ({ page, request }) => {
  await page.goto("/live");
  const line = page.getByText(/Reviews on the site: \d+/);
  const before = Number((await line.innerText()).match(/\d+/)[0]);

  const created = await request.post("/api/trails/pine-hollow/reviews", {
    data: { rating: 4, text: "Quiet, and good for kids." },
  });
  expect(created.status()).toBe(201);

  // The page asks every 5 seconds
  await expect(async () => {
    const text = await line.innerText();
    expect(Number(text.match(/\d+/)[0])).toBeGreaterThan(before);
  }).toPass({ timeout: 15_000 });
});

test("the stream shows a new review within seconds", async ({ page, request }) => {
  await page.goto("/live");
  const line = page.getByText(/Live from the stream: \d+/);
  await expect(line).toBeVisible();
  const before = Number((await line.innerText()).match(/\d+/)[0]);

  const created = await request.post("/api/trails/ridge-line/reviews", {
    data: { rating: 3, text: "Exposed in the wind, bring a layer." },
  });
  expect(created.status()).toBe(201);

  // The server pushes the change
  await expect(async () => {
    const text = await line.innerText();
    expect(Number(text.match(/\d+/)[0])).toBeGreaterThan(before);
  }).toPass({ timeout: 3000 });
});
