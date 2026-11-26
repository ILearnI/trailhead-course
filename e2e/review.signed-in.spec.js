import { expect, test } from "./fixtures";

test("a user adds a review, then logs out", async ({
  page,
  reviewsPage,
  accountPage,
}) => {
  // Unique: the reviews of this form
  // are kept between runs
  const text = `Steep, wet, and worth it (${Date.now()})`;
  await reviewsPage.goto("cedar-falls");
  await reviewsPage.addReview({ name: "Test User", rating: 5, text });
  await expect(reviewsPage.confirmation).toBeVisible();
  await expect(reviewsPage.item(text)).toHaveCount(1);

  await accountPage.goto();
  await accountPage.logOut();
  await expect(page).toHaveURL(/\/login/);
});
