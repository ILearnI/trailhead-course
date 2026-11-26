import { expect, test } from "./fixtures";

const stream = (route, status, body) =>
  route.fulfill({ status, contentType: "text/plain", body });

test("the description appears under the button", async ({ page }) => {
  // No real model: the answer is made up
  await page.route("**/api/describe", (route) =>
    stream(route, 200, "A calm loop around a lake."),
  );
  await page.goto("/trails/alpine-lake");
  await page.getByRole("button", { name: "Describe this trail" }).click();
  await expect(page.getByText("A calm loop around a lake.")).toBeVisible();
});

test("an error is told to the visitor", async ({ page }) => {
  await page.route("**/api/describe", (route) => stream(route, 500, "no"));
  await page.goto("/trails/alpine-lake");
  await page.getByRole("button", { name: "Describe this trail" }).click();
  const section = page.getByRole("region", { name: "Description" });
  await expect(section.getByRole("alert")).toHaveText(
    "The description could not be written.",
  );
});
