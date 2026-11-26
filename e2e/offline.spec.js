import { expect, test } from "./fixtures";

test("a banner tells when the connection is gone", async ({ page, context }) => {
  await page.goto("/");
  const banner = page.getByRole("status").filter({ hasText: "You are offline" });
  await expect(banner).toBeHidden();

  await context.setOffline(true);
  await expect(banner).toBeVisible();

  await context.setOffline(false);
  await expect(banner).toBeHidden();
});

test("a navigation waits for the network", async ({ page, context }) => {
  await page.goto("/");
  // Let the link prefetch the shell of the page
  await page.waitForTimeout(1000);

  await context.setOffline(true);
  await page.getByRole("link", { name: "Live counters" }).click();
  await expect(page.getByRole("heading", { name: "Live" })).toBeVisible();
  await expect(page.getByText("Waiting for the connection...")).toBeVisible();

  await context.setOffline(false);
  await expect(page.getByText(/Hikers now: \d+/)).toBeVisible();
});

test("a message sent offline goes out later", async ({ page, context }) => {
  await page.goto("/contact");
  const form = page.locator("#message-form");
  await form.getByLabel("Your name").fill("Maya");
  await form.getByLabel("Your message").fill("Is the lake trail open?");

  await context.setOffline(true);
  await form.getByRole("button", { name: "Send" }).click();
  await expect(form.getByRole("button", { name: "Sending..." })).toBeVisible();

  await context.setOffline(false);
  await expect(form.getByText("Message sent.")).toBeVisible({ timeout: 15_000 });
});
