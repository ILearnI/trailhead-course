import { expect, test } from "./fixtures";

// Event stream lines, from a list of parts
const sse = (parts) =>
  parts.map((part) => `data: ${JSON.stringify(part)}\n\n`).join("") +
  "data: [DONE]\n\n";

const text = (words) => [
  { type: "text-start", id: "0" },
  { type: "text-delta", id: "0", delta: words },
  { type: "text-end", id: "0" },
];

// What the server sends for a short answer
const answer = (words) =>
  sse([
    { type: "start" },
    { type: "start-step" },
    ...text(words),
    { type: "finish-step" },
    { type: "finish", finishReason: "stop" },
  ]);

// A lookup first, then the answer
const lookup = (words, toolName = "findTrails") =>
  sse([
    { type: "start" },
    { type: "start-step" },
    { type: "tool-input-available", toolCallId: "c1", toolName, input: {} },
    { type: "tool-output-available", toolCallId: "c1", output: [{ name: "Cedar Falls" }] },
    { type: "finish-step" },
    { type: "start-step" },
    ...text(words),
    { type: "finish-step" },
    { type: "finish", finishReason: "stop" },
  ]);

test("a question gets an answer", async ({ page }) => {
  // No real model: the answer is made up
  await page.route("**/api/chat", (route) =>
    route.fulfill({
      contentType: "text/event-stream",
      headers: { "x-vercel-ai-ui-message-stream": "v1" },
      body: answer("Cedar Falls is the easiest."),
    }),
  );
  await page.goto("/assistant");
  await page.getByLabel("Your question").fill("Which trail is easy?");
  await page.getByRole("button", { name: "Ask" }).click();

  const chat = page.getByRole("region", { name: "Assistant" });
  await expect(chat.getByText("Which trail is easy?")).toBeVisible();
  await expect(chat.getByText("Cedar Falls is the easiest.")).toBeVisible();
  await expect(page.getByLabel("Your question")).toHaveValue("");
});

test("an error is told, and the chat stays usable", async ({ page }) => {
  await page.route("**/api/chat", (route) => route.fulfill({ status: 500, body: "no" }));
  await page.goto("/assistant");
  await page.getByLabel("Your question").fill("Hello?");
  await page.getByRole("button", { name: "Ask" }).click();

  const chat = page.getByRole("region", { name: "Assistant" });
  await expect(chat.getByRole("alert")).toHaveText("Something went wrong. Try again.");
  await expect(page.getByRole("button", { name: "Ask" })).toBeVisible();
});

test("the visitor sees that the assistant looked something up", async ({ page }) => {
  await page.route("**/api/chat", (route) =>
    route.fulfill({
      contentType: "text/event-stream",
      headers: { "x-vercel-ai-ui-message-stream": "v1" },
      body: lookup("Cedar Falls is on the coast."),
    }),
  );
  await page.goto("/assistant");
  await page.getByLabel("Your question").fill("Which trail is on the coast?");
  await page.getByRole("button", { name: "Ask" }).click();

  const chat = page.getByRole("region", { name: "Assistant" });
  await expect(chat.getByText("Looked at the list of trails")).toBeVisible();
  await expect(chat.getByText("Cedar Falls is on the coast.")).toBeVisible();
});

test("the visitor sees that the assistant compared trails", async ({ page }) => {
  await page.route("**/api/chat", (route) =>
    route.fulfill({
      contentType: "text/event-stream",
      headers: { "x-vercel-ai-ui-message-stream": "v1" },
      body: lookup("Cedar Falls is shorter.", "compareTrails"),
    }),
  );
  await page.goto("/assistant");
  await page.getByLabel("Your question").fill("Cedar Falls or Salt Marsh?");
  await page.getByRole("button", { name: "Ask" }).click();

  const chat = page.getByRole("region", { name: "Assistant" });
  await expect(chat.getByText("Looked at a comparison of trails")).toBeVisible();
  await expect(chat.getByText("Cedar Falls is shorter.")).toBeVisible();
});
