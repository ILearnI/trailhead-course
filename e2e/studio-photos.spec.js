import { expect, test } from "./fixtures";
import { openStudioAs } from "./roles";

const nameOf = (user) => `Zzz ${user.email.split("@")[0]}`;
const slugOf = (user) => nameOf(user).toLowerCase().replaceAll(" ", "-");
const PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAh" +
    "KmMIQAAAABJRU5ErkJggg==",
  "base64",
);

test.beforeEach(async ({ context }) => {
  const cookie = { name: "consent", value: "yes", url: "http://localhost:3000" };
  await context.addCookies([cookie]);
});

async function fillTrail(page, user, file) {
  await page.goto("/studio/trails/new");
  await page.getByLabel("Name").fill(nameOf(user));
  await page.getByLabel("Region").selectOption("coast");
  await page.getByLabel("Level").selectOption("Easy");
  await page.getByLabel("Distance (km)").fill("3");
  await page.getByLabel("Photo").setInputFiles(file);
  await page.getByRole("button", { name: "Save trail" }).click();
}

test("an editor adds a photo to a trail", async ({ page, signupPage, loginPage, user }) => {
  await openStudioAs("editor", { page, signupPage, loginPage, user });
  await fillTrail(page, user, { name: "a.png", mimeType: "image/png", buffer: PNG });
  await expect(page).toHaveURL("/studio/trails");
  await page.goto(`/trails/${slugOf(user)}`);
  const photo = page.getByRole("img", { name: `Photo of ${nameOf(user)}` });
  await expect.poll(() => photo.evaluate((img) => img.naturalWidth)).toBeGreaterThan(0);
});

test("a fake image is refused", async ({ page, signupPage, loginPage, user }) => {
  await openStudioAs("editor", { page, signupPage, loginPage, user });
  const fake = { name: "a.png", mimeType: "image/png", buffer: Buffer.from("<script>") };
  await fillTrail(page, user, fake);
  await expect(page.getByText("Choose a JPEG, PNG or WebP image")).toBeVisible();
  await expect(page).toHaveURL("/studio/trails/new");
});
