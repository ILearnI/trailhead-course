// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { sayingModel } from "@/test/mock-model";

const model = sayingModel(["Cedar Falls ", "is easy."]);
vi.mock("@/lib/ai", () => ({ getModel: () => model }));
vi.mock("@/lib/assistant", () => ({ assistantSystem: () => "SYSTEM TEXT" }));
vi.mock("@/lib/assistant-tools", () => ({ assistantTools: {} }));

import { POST } from "./route";

const ask = (text) =>
  POST(
    new Request("http://localhost/api/chat", {
      method: "POST",
      body: JSON.stringify({
        messages: [{ id: "1", role: "user", parts: [{ type: "text", text }] }],
      }),
    }),
  );

describe("POST /api/chat", () => {
  it("streams the answer as messages with parts", async () => {
    const response = await ask("Which trail is easy?");
    expect(response.headers.get("x-vercel-ai-ui-message-stream")).toBe("v1");
    const body = await response.text();
    expect(body).toContain('"type":"text-delta"');
    expect(body).toContain("is easy.");
  });

  it("sends the system text and the question to the model", async () => {
    await (await ask("Which trail is easy?")).text();
    const prompt = JSON.stringify(model.doStreamCalls.at(-1).prompt);
    expect(prompt).toContain("SYSTEM TEXT");
    expect(prompt).toContain("Which trail is easy?");
  });

  it("refuses a body that is not a conversation", async () => {
    const response = await POST(
      new Request("http://localhost/api/chat", {
        method: "POST",
        headers: { "x-forwarded-for": "5.5.5.5" },
        body: JSON.stringify({ messages: [] }),
      }),
    );
    expect(response.status).toBe(400);
  });

  it("refuses a question that is too long", async () => {
    const response = await ask("a".repeat(501));
    expect(response.status).toBe(400);
  });
});
