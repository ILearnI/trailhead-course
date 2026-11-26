import { expect, test } from "@playwright/test";

test("asking about a topic shows it on the page", async ({ page }) => {
  await page.goto("/contact");
  await page.getByRole("textbox", { name: "Topic" }).fill("weather");
  await page.getByRole("button", { name: "Ask" }).click();
  await expect(page).toHaveURL(/topic=weather/);
  await expect(page.getByText("You asked about weather.")).toBeVisible();
});

test("a message can be sent", async ({ page }) => {
  await page.goto("/contact");
  const form = page.locator("#message-form");
  await form.getByLabel("Your name").fill("Maya");
  await form.getByLabel("Your message").fill("Is the lake trail open?");
  await form.getByLabel("Topic").selectOption("weather");
  await form.getByLabel("Send me news").check();
  await form.getByRole("button", { name: "Send" }).click();
  await expect(form.getByText("Message sent.")).toBeVisible();
});

test("a trail card links to its reviews", async ({ page }) => {
  await page.goto("/trails");
  const card = page.getByRole("listitem").filter({ hasText: "Cedar Falls" });
  await card.getByRole("link", { name: "Reviews" }).click();
  await expect(page).toHaveURL(/\/trails\/cedar-falls\/reviews/);
  await expect(page.getByRole("heading", { name: "Reviews" })).toBeVisible();
});

test("the faq has two questions", async ({ page }) => {
  await page.goto("/faq");
  await expect(page.getByText(/\?$/)).toHaveCount(2);
});
