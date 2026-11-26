// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { textModel } from "@/test/mock-model";

vi.mock("server-only", () => ({}));
let answer = "";
vi.mock("@/lib/ai", () => ({ getModel: () => textModel(answer) }));

import { parseSearch } from "./search-ai";

describe("parseSearch", () => {
  it("returns the filters that the model found", async () => {
    answer = JSON.stringify({ region: "coast", level: "Easy", maxKm: 5 });
    expect(await parseSearch("an easy walk by the sea")).toEqual({
      region: "coast",
      level: "Easy",
      maxKm: 5,
    });
  });

  it("throws when the answer does not match the schema", async () => {
    answer = JSON.stringify({ region: "moon", level: null, maxKm: null });
    await expect(parseSearch("somewhere strange")).rejects.toThrow();
  });
});
