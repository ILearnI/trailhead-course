import { expect, test } from "@playwright/test";
import { instant } from "@next/playwright";

test("the dashboard shows both kinds of card", async ({ page }) => {
  await page.goto("/analytics");
  await expect(page.getByText("Totals")).toBeVisible();
  await expect(page.getByText(/\d+ new reviews/)).toBeVisible();
});

test("the shell comes first, the live card streams in", async ({
  page,
  baseURL,
}) => {
  await instant(
    page,
    async () => {
      await page.goto("/analytics");
      // The cached cards are in the shell
      await expect(page.getByText("Totals")).toBeVisible();
      // The live card has not arrived yet
      await expect(page.getByText("new reviews")).toHaveCount(0);
    },
    { baseURL },
  );
  // After the scope, the live card arrives
  await expect(page.getByText(/\d+ new reviews/)).toBeVisible();
});

test("a link that prefetches shows the title at once", async ({ page }) => {
  await page.goto("/cache-lab");
  await instant(page, async () => {
    await page.click("#eager");
    await page.waitForURL((url) => url.pathname === "/cache-lab/topic");
    await expect(page.getByText("Topic beta")).toBeVisible();
    await expect(page.getByText("Loading body...")).toBeVisible();
  });
  await expect(page.getByText("Body of beta")).toBeVisible();
});
