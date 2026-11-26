// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { tool } from "ai";
import { z } from "zod";
import { callingModel } from "@/test/mock-model";

// The model asks for the tool, then answers
const model = callingModel({
  toolName: "findTrails",
  input: { region: "coast" },
  answer: "Cedar Falls is on the coast.",
});
vi.mock("@/lib/ai", () => ({ getModel: () => model }));
vi.mock("@/lib/assistant", () => ({ assistantSystem: () => "SYSTEM TEXT" }));
vi.mock("@/lib/assistant-tools", () => ({
  assistantTools: {
    findTrails: tool({
      description: "List the trails",
      inputSchema: z.object({ region: z.string().optional() }),
      execute: async () => [{ name: "Cedar Falls" }],
    }),
  },
}));

import { POST } from "./route";

describe("POST /api/chat with a tool", () => {
  it("runs the tool, and sends its result and the answer", async () => {
    const response = await POST(
      new Request("http://localhost/api/chat", {
        method: "POST",
        body: JSON.stringify({
          messages: [{ id: "1", role: "user", parts: [{ type: "text", text: "Coast?" }] }],
        }),
      }),
    );
    const body = await response.text();
    expect(body).toContain('"type":"tool-input-available"');
    expect(body).toContain('"type":"tool-output-available"');
    expect(body).toContain("Cedar Falls is on the coast.");
  });
});
