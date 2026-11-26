import { expect, test } from "./fixtures";

test("an empty search asks for a sentence", async ({ page }) => {
  await page.goto("/find");
  await page.getByRole("button", { name: "Find trails" }).click();
  const search = page.getByRole("region", { name: "Search" });
  await expect(search.getByRole("alert")).toHaveText("Describe the trail that you want.");
});

test("a sentence that is too long is refused", async ({ page }) => {
  await page.goto("/find");
  await page.getByLabel("What are you looking for?").fill("a".repeat(201));
  await page.getByRole("button", { name: "Find trails" }).click();
  const search = page.getByRole("region", { name: "Search" });
  await expect(search.getByRole("alert")).toContainText("under 200 characters");
});
