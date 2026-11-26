import { describe, expect, it } from "vitest";
import { filterTrails } from "./filter-trails";

const trails = [
  { slug: "a", region: "coast", level: "Easy", km: 4 },
  { slug: "b", region: "alps", level: "Hard", km: 14 },
  { slug: "c", region: "coast", level: "Hard", km: 9 },
];
const slugs = (list) => list.map((trail) => trail.slug);

describe("filterTrails", () => {
  it("keeps everything without a filter", () => {
    expect(filterTrails(trails, {})).toHaveLength(3);
  });

  it("combines the filters", () => {
    expect(slugs(filterTrails(trails, { region: "coast", level: "Hard" }))).toEqual(["c"]);
  });

  it("keeps the trails up to a length", () => {
    expect(slugs(filterTrails(trails, { maxKm: 9 }))).toEqual(["a", "c"]);
  });

  it("treats null as no filter", () => {
    expect(filterTrails(trails, { region: null, level: null, maxKm: null })).toHaveLength(3);
  });
});
