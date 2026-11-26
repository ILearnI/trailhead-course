// @vitest-environment node
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/dal/trails", () => ({
  listTrails: async () => [
    { slug: "cedar-falls", name: "Cedar Falls", region: "coast", level: "Easy", km: 4.2 },
    { slug: "ridge-line", name: "Ridge Line", region: "alps", level: "Hard", km: 14.6 },
    { slug: "salt-marsh", name: "Salt Marsh", region: "coast", level: "Easy", km: 3.5 },
  ],
  getTrail: async (slug) =>
    slug === "cedar-falls" ? { slug, name: "Cedar Falls", km: 4.2 } : null,
}));
vi.mock("@/dal/reviews", () => ({
  listReviews: async () => [{ rating: 5 }, { rating: 4 }],
}));

import { assistantTools } from "./assistant-tools";

const run = (name, input) => assistantTools[name].execute(input, {});

describe("findTrails", () => {
  it("gives every trail without a filter", async () => {
    expect(await run("findTrails", {})).toHaveLength(3);
  });

  it("filters by region and level", async () => {
    const found = await run("findTrails", { region: "coast", level: "Easy" });
    expect(found.map((trail) => trail.slug)).toEqual(["cedar-falls", "salt-marsh"]);
  });

  it("filters by length", async () => {
    const found = await run("findTrails", { maxKm: 4 });
    expect(found.map((trail) => trail.slug)).toEqual(["salt-marsh"]);
  });
});

describe("getTrailDetails", () => {
  it("adds the number of reviews and the average", async () => {
    const details = await run("getTrailDetails", { slug: "cedar-falls" });
    expect(details).toMatchObject({ name: "Cedar Falls", reviews: 2, average: 4.5 });
  });

  it("says when the trail does not exist", async () => {
    expect(await run("getTrailDetails", { slug: "nope" })).toEqual({
      error: "No such trail",
    });
  });
});

describe("compareTrails", () => {
  it("gives the details of each trail, in order", async () => {
    const rows = await run("compareTrails", { slugs: ["cedar-falls", "nope"] });
    expect(rows[0]).toMatchObject({ name: "Cedar Falls", average: 4.5 });
    expect(rows[1]).toEqual({ error: "No such trail" });
  });

  it("refuses one trail, and more than three", () => {
    const schema = assistantTools.compareTrails.inputSchema;
    expect(schema.safeParse({ slugs: ["a"] }).success).toBe(false);
    expect(schema.safeParse({ slugs: ["a", "b", "c", "d"] }).success).toBe(false);
  });
});
