import { expect, test } from "./fixtures";
import { openStudioAs } from "./roles";

// Sorts last, and different for each user
const nameOf = (user) => `Zzz ${user.email.split("@")[0]}`;
const slugOf = (user) => nameOf(user).toLowerCase().replaceAll(" ", "-");

test.beforeEach(async ({ context }) => {
  const cookie = { name: "consent", value: "yes", url: "http://localhost:3000" };
  await context.addCookies([cookie]);
});

async function createTrail(page, name) {
  await page.goto("/studio/trails/new");
  await page.getByLabel("Name").fill(name);
  await page.getByLabel("Region").selectOption("alps");
  await page.getByLabel("Level").selectOption("Easy");
  await page.getByLabel("Distance (km)").fill("4.5");
  await page.getByRole("button", { name: "Save trail" }).click();
  await expect(page).toHaveURL("/studio/trails");
}

test("an editor creates a trail", async ({ page, signupPage, loginPage, user }) => {
  await openStudioAs("editor", { page, signupPage, loginPage, user });
  await createTrail(page, nameOf(user));
  await expect(page.getByRole("cell", { name: nameOf(user) })).toBeVisible();
  await page.goto(`/trails/${slugOf(user)}`);
  await expect(page.getByRole("heading", { name: nameOf(user) })).toBeVisible();
});

test("the form explains what is wrong", async ({ page, signupPage, loginPage, user }) => {
  await openStudioAs("editor", { page, signupPage, loginPage, user });
  await page.goto("/studio/trails/new");
  await page.getByRole("button", { name: "Save trail" }).click();
  await expect(page.getByText("At least 3 letters")).toBeVisible();
  await expect(page.getByText("Pick a region")).toBeVisible();
  await expect(page).toHaveURL("/studio/trails/new");
});

test("an editor edits and deletes", async ({ page, signupPage, loginPage, user }) => {
  await openStudioAs("editor", { page, signupPage, loginPage, user });
  await createTrail(page, nameOf(user));
  await page.goto(`/studio/trails/${slugOf(user)}/edit`);
  await page.getByLabel("Distance (km)").fill("7");
  await page.getByRole("button", { name: "Save trail" }).click();
  await expect(page.getByRole("row", { name: /7 km/ })).toBeVisible();
  await page.goto(`/studio/trails/${slugOf(user)}/edit`);
  await page.getByLabel("Yes, delete this trail and its reviews").check();
  await page.getByRole("button", { name: "Delete trail" }).click();
  await expect(page.getByRole("cell", { name: nameOf(user) })).toHaveCount(0);
});
