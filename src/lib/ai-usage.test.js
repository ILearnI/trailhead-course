import { describe, expect, it } from "vitest";
import { estimateCost } from "./ai-usage";

describe("estimateCost", () => {
  it("prices the tokens that went in and out", () => {
    const cost = estimateCost({ inputTokens: 1000, outputTokens: 500 });
    expect(cost).toBeCloseTo(0.0003, 6);
  });

  it("is zero without tokens", () => {
    expect(estimateCost({})).toBe(0);
  });
});
