// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createTestDb } from "@/test/db";
import { seedTestDb } from "@/test/seed";

// The database that the layer will see
const state = vi.hoisted(() => ({ db: null }));
vi.mock("@/db", () => ({
  get db() {
    return state.db;
  },
}));

// server-only throws outside of the server: fake it
vi.mock("server-only", () => ({}));
// The cache functions need a real request: fake them
vi.mock("next/cache", () => ({ cacheLife: vi.fn(), cacheTag: vi.fn() }));

import { getTrail, listTrails, searchTrails, topTrails } from "./trails";

// A seeded database before every test
beforeEach(() => {
  state.db = createTestDb().db;
  seedTestDb(state.db);
});

describe("listTrails", () => {
  it("lists the trails by name, with the columns of a list", async () => {
    const items = await listTrails();
    expect(items).toHaveLength(7);
    expect(items[0].name).toBe("Alpine Lake Loop");
    expect(Object.keys(items[0])).toEqual(["slug", "name", "region", "level", "km"]);
  });
});

describe("getTrail", () => {
  it("returns a trail with its description", async () => {
    const trail = await getTrail("cedar-falls");
    expect(trail.description).toMatch(/waterfall/);
  });

  it("returns null for an unknown slug", async () => {
    expect(await getTrail("nowhere")).toBeNull();
  });
});

describe("topTrails", () => {
  it("ranks by average, needs two reviews, and gives numbers", async () => {
    const board = await topTrails(3);
    const names = board.map((trail) => trail.name);
    expect(names).toEqual(["Alpine Lake Loop", "Cedar Falls", "Salt Marsh Walk"]);
    expect(typeof board[0].average).toBe("number");
  });
});

describe("searchTrails", () => {
  it("finds a trail by part of its name", async () => {
    const result = await searchTrails({ q: "lake" });
    expect(result.items.map((trail) => trail.name)).toEqual(["Alpine Lake Loop"]);
  });

  it("does not treat a percent sign as a wildcard", async () => {
    expect((await searchTrails({ q: "%" })).total).toBe(0);
  });

  it("filters by level and pages the result", async () => {
    const page2 = await searchTrails({ level: "Easy", page: 2 });
    expect([page2.total, page2.pages, page2.page, page2.items.length]).toEqual([4, 2, 2, 1]);
  });

  it("clamps a page that is too high", async () => {
    expect((await searchTrails({ page: 99 })).page).toBe(3);
  });
});
