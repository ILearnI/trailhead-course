import { describe, expect, it } from "vitest";
import { tags } from "./tags";

describe("tags", () => {
  it("keeps the names that other code depends on", () => {
    expect(tags.trails).toBe("trails");
    expect(tags.ranking).toBe("ranking");
    expect(tags.trail("alpine-lake")).toBe("trail:alpine-lake");
    expect(tags.reviews("alpine-lake")).toBe("reviews:alpine-lake");
  });

  it("gives each trail its own tag, for its reviews", () => {
    expect(tags.reviews("a")).not.toBe(tags.reviews("b"));
    expect(tags.reviews("a")).not.toBe(tags.trail("a"));
  });
});
