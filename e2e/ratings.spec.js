import { expect, test } from "./fixtures";

test("a trail shows its average rating", async ({ page }) => {
  await page.goto("/trails/ridge-line");
  await expect(page.getByText("Rated 3.5 out of 5, from 2 reviews")).toBeVisible();
});

test("one review is not plural", async ({ page }) => {
  await page.goto("/trails/granite-peak");
  await expect(page.getByText("Rated 5 out of 5, from 1 review")).toBeVisible();
});

test("the bars count each rating", async ({ page }) => {
  await page.goto("/trails/ridge-line");
  const ratings = page.getByRole("region", { name: "Ratings" });
  const row = (stars) => ratings.getByRole("listitem").filter({ hasText: stars });
  await expect(row("4 stars")).toContainText("1");
  await expect(row("5 stars")).toContainText("0");
});

test("a screen reader reads the summary in order", async ({ page }) => {
  await page.goto("/trails/ridge-line");
  await expect(page.getByRole("region", { name: "Ratings" })).toMatchAriaSnapshot(`
    - region "Ratings":
      - paragraph: Rated 3.5 out of 5, from 2 reviews
      - list:
        - listitem: 5 stars 0
        - listitem: 4 stars 1
        - listitem: 3 stars 1
        - listitem: 2 stars 0
        - listitem: 1 star 0
  `);
});
