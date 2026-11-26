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

import { topTrails } from "./trails";
import { createReview, listReviews } from "./reviews";

// A seeded database before every test
beforeEach(() => {
  state.db = createTestDb().db;
  seedTestDb(state.db);
});

describe("listReviews", () => {
  it("lists the newest first, with the author", async () => {
    const items = await listReviews("pine-hollow");
    expect(items.map((review) => review.author)).toEqual(["Tom Rivera", "Lena Fischer"]);
  });

  it("gives a trail without reviews an empty list", async () => {
    expect(await listReviews("fern-gully")).toEqual([]);
  });
});

describe("createReview", () => {
  it("adds an anonymous review, shown first", async () => {
    await createReview({ slug: "pine-hollow", rating: 4, text: "Damp and green." });
    const items = await listReviews("pine-hollow");
    const authors = items.map((review) => review.author);
    expect(authors).toEqual(["Anonymous", "Tom Rivera", "Lena Fischer"]);
  });

  it("returns null for an unknown trail", async () => {
    const review = { slug: "nowhere", rating: 4, text: "Nothing here." };
    expect(await createReview(review)).toBeNull();
  });
});

describe("the leaderboard follows the reviews", () => {
  it("puts the granite peak first after a second perfect review", async () => {
    expect((await topTrails(1))[0].name).toBe("Alpine Lake Loop");
    await createReview({ slug: "granite-peak", rating: 5, text: "Perfect again." });
    expect((await topTrails(1))[0].name).toBe("Granite Peak");
  });
});
