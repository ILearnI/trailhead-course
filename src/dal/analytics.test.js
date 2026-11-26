// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cacheLife, cacheTag } from "next/cache";
import { counts } from "@/lib/calls";
import { tags } from "@/lib/tags";
import { createTestDb } from "@/test/db";
import { seedTestDb } from "@/test/seed";

// The database that the layer will see
const state = vi.hoisted(() => ({ db: null }));
vi.mock("@/db", () => ({
  get db() {
    return state.db;
  },
}));
vi.mock("server-only", () => ({}));
// The cache functions need a request: fake them
vi.mock("next/cache", () => ({ cacheLife: vi.fn(), cacheTag: vi.fn() }));

import { getByRegion, getNewest, getRecent, getTotals } from "./analytics";

beforeEach(() => {
  state.db = createTestDb().db;
  seedTestDb(state.db);
  // The slow queries wait: the test moves the clock
  vi.useFakeTimers();
  // Forget what the other tests left
  globalThis.__calls = {};
  vi.clearAllMocks();
});

afterEach(() => vi.useRealTimers());

// Runs a slow function, moving the clock past it
async function finish(promise) {
  await vi.advanceTimersByTimeAsync(1000);
  return promise;
}

describe("getTotals", () => {
  it("counts the reviews and the trails", async () => {
    const totals = await finish(getTotals());
    expect(totals.reviews).toBe(12);
    expect(totals.trailCount).toBe(7);
  });

  it("declares its lifetime and its tag", async () => {
    await finish(getTotals());
    expect(cacheLife).toHaveBeenCalledWith("community");
    expect(cacheTag).toHaveBeenCalledWith(tags.ranking);
  });

  it("ran once for one call", async () => {
    await finish(getTotals());
    expect(counts()["analytics:totals"]).toBe(1);
  });
});

describe("getByRegion", () => {
  it("ends with the ranking and with the trails", async () => {
    await finish(getByRegion());
    expect(cacheTag).toHaveBeenCalledWith(tags.ranking, tags.trails);
  });

  it("lists the three regions", async () => {
    const { rows } = await finish(getByRegion());
    expect(rows.map((r) => r.region).sort()).toEqual(["alps", "coast", "forest"]);
  });
});

describe("getNewest", () => {
  it("returns three names, with the catalog lifetime", async () => {
    const { rows } = await finish(getNewest());
    expect(rows).toHaveLength(3);
    expect(cacheLife).toHaveBeenCalledWith("catalog");
  });
});

describe("getRecent", () => {
  it("is never cached", async () => {
    await getRecent();
    expect(cacheLife).not.toHaveBeenCalled();
    expect(cacheTag).not.toHaveBeenCalled();
  });
});
