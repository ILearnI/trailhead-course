import { expect, test } from "@playwright/test";

// The bodies of the requests that count views
function watch(page) {
  const sent = [];
  page.on("request", (request) => {
    const ours = request.url().includes("/api/analytics");
    if (ours && request.method() === "POST") sent.push(request.postData());
  });
  return sent;
}

test("nothing is counted before the visitor agrees", async ({ page }) => {
  const sent = watch(page);
  await page.goto("/about");
  await page.getByRole("button", { name: "Accept" }).waitFor();
  expect(sent).toHaveLength(0);
});

test("a view is counted after accepting", async ({ page }) => {
  const sent = watch(page);
  await page.goto("/about");
  const answer = page.waitForResponse((r) => r.url().includes("/api/analytics"));
  await page.getByRole("button", { name: "Accept" }).click();
  expect((await answer).status()).toBe(204);
  expect(sent[0]).toBe('{"path":"/about"}');
});

test("a browser that says no is obeyed, without asking", async ({ page }) => {
  const sent = watch(page);
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "globalPrivacyControl", { value: true });
  });
  await page.goto("/about", { waitUntil: "networkidle" });
  await expect(page.getByRole("button", { name: "Accept" })).toHaveCount(0);
  expect(sent).toHaveLength(0);
});
