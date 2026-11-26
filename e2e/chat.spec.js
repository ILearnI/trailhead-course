import { expect, test } from "./fixtures";

test("a message reaches the other visitor", async ({ browser, baseURL }) => {
  // Two visitors: two browsers, nothing shared
  const maya = await (await browser.newContext()).newPage();
  const tom = await (await browser.newContext()).newPage();
  await maya.goto(`${baseURL}/live`);
  await tom.goto(`${baseURL}/live`);

  await maya.getByLabel("Message").fill("Is the lake trail open?");
  await maya.getByRole("button", { name: "Send" }).click();

  await expect(tom.getByText("A hiker: Is the lake trail open?")).toBeVisible();
  await expect(maya.getByText("A hiker: Is the lake trail open?")).toBeVisible();
});
