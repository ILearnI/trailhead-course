import { describe, expect, it } from "vitest";
import { describeTrail } from "./describe-trail";

describe("describeTrail", () => {
  const trail = { slug: "alpine-lake", description: "A loop." };

  it("uses the translation, when there is one", () => {
    expect(describeTrail(trail, "fr").lang).toBe("fr");
  });

  it("falls back to English, and says so", () => {
    const other = { slug: "fern-gully", description: "A mossy valley." };
    expect(describeTrail(other, "fr")).toEqual({ text: "A mossy valley.", lang: "en" });
  });
});
