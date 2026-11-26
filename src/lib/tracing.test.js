import { describe, expect, it } from "vitest";
import { withSpan } from "./tracing";

describe("withSpan", () => {
  it("returns what the work returns", async () => {
    expect(await withSpan("x", { a: 1 }, async () => 42)).toBe(42);
  });

  it("lets the error through", async () => {
    const work = async () => {
      throw new Error("boom");
    };
    await expect(withSpan("x", {}, work)).rejects.toThrow("boom");
  });
});
