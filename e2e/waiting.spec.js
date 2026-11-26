import { expect, test } from "@playwright/test";

test("a message is confirmed", async ({ page }) => {
  await page.goto("/contact");
  const form = page.locator("#message-form");
  await form.getByLabel("Your name").fill("Maya");
  await form.getByLabel("Your message").fill("Is the lake trail open?");
  await form.getByRole("button", { name: "Send" }).click();
  await expect(form.getByText("Message sent.")).toBeVisible();
});
