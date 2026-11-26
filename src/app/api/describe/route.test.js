// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { sayingModel } from "@/test/mock-model";

// No real model, no database
const model = sayingModel(["A calm ", "loop."]);
vi.mock("@/lib/ai", () => ({ getModel: () => model }));
vi.mock("@/dal/trails", () => ({
  getTrail: async (slug) =>
    slug === "alpine-lake"
      ? { name: "Alpine Lake Loop", region: "alps", level: "Moderate", km: 8.4 }
      : null,
}));

import { POST } from "./route";

const post = (slug) =>
  POST(
    new Request("http://localhost/api/describe", {
      method: "POST",
      body: JSON.stringify({ slug }),
    }),
  );

describe("POST /api/describe", () => {
  it("streams the text of the model", async () => {
    const response = await post("alpine-lake");
    expect(response.status).toBe(200);
    expect(await response.text()).toBe("A calm loop.");
  });

  it("answers 404 for an unknown trail", async () => {
    expect((await post("nope")).status).toBe(404);
  });

  it("does not call the model twice for the same trail", async () => {
    await (await post("alpine-lake")).text();
    const calls = model.doStreamCalls.length;
    const again = await post("alpine-lake");
    expect(await again.text()).toBe("A calm loop.");
    expect(model.doStreamCalls).toHaveLength(calls);
  });
});
