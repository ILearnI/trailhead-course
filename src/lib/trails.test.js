import { describe, it, expect } from "vitest";
import { getTrail, trailParams } from "@/lib/trails";

describe("getTrail", () => {
  it("finds a trail by slug", () => {
    expect(getTrail("cedar-falls").name).toBe("Cedar Falls");
  });

  it("lists one slug per trail", () => {
    const params = trailParams();
    expect(params).toHaveLength(6);
    expect(params[0]).toEqual({ slug: "alpine-lake" });
  });
});
