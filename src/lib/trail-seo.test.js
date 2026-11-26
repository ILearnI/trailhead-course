import { describe, expect, it } from "vitest";
import { trailDescription, trailMetadata } from "./trail-seo";

const trail = {
  slug: "alpine-lake",
  name: "Alpine Lake Loop",
  description: "A loop around a glacial lake.",
  region: "alps",
  level: "Moderate",
  km: 11.5,
};

describe("trailDescription", () => {
  it("adds the facts to the sentence", () => {
    expect(trailDescription(trail)).toBe(
      "A loop around a glacial lake. 11.5 km, moderate, in the alps.",
    );
  });

  it("never goes over 160 characters", () => {
    const long = { ...trail, description: "x".repeat(300) };
    expect(trailDescription(long)).toHaveLength(160);
  });
});

describe("trailMetadata", () => {
  it("gives the name, the canonical address and the card", () => {
    const meta = trailMetadata(trail);
    expect(meta.title).toBe("Alpine Lake Loop");
    expect(meta.alternates.canonical).toBe("/trails/alpine-lake");
    expect(meta.openGraph.type).toBe("article");
  });
});
