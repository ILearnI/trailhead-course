// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import { eq } from "drizzle-orm";
import { reviews, trails } from "@/db/schema";
import { createTestDb } from "@/test/db";
import { createTrail } from "@/test/factories";
import { seedTestDb } from "@/test/seed";

// The database that the layer will see
const state = vi.hoisted(() => ({ db: null }));
vi.mock("@/db", () => ({
  get db() {
    return state.db;
  },
}));
vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({ cacheLife: vi.fn(), cacheTag: vi.fn() }));

import { mergeTrails } from "./trails";

let sqlite;
let copy;

// A seeded database, and a copy to merge
beforeEach(() => {
  ({ db: state.db, sqlite } = createTestDb());
  seedTestDb(state.db);
  copy = createTrail(state.db, { slug: "alpine-lake-copy" });
  state.db
    .insert(reviews)
    .values({ trailId: copy.id, rating: 4, text: "On the copy." })
    .run();
});

// How many reviews a trail has
const reviewsOf = (slug) =>
  state.db
    .select({ id: reviews.id })
    .from(reviews)
    .innerJoin(trails, eq(reviews.trailId, trails.id))
    .where(eq(trails.slug, slug))
    .all().length;

describe("mergeTrails", () => {
  it("moves the reviews, and deletes the copy", async () => {
    expect(await mergeTrails("alpine-lake-copy", "alpine-lake")).toEqual({ moved: 1 });
    expect(reviewsOf("alpine-lake")).toBe(4);
    const gone = state.db.select().from(trails).where(eq(trails.id, copy.id)).get();
    expect(gone).toBeUndefined();
  });

  it("refuses an unknown trail, and changes nothing", async () => {
    const merge = mergeTrails("alpine-lake-copy", "nowhere");
    await expect(merge).rejects.toThrow("Unknown trail");
    expect(reviewsOf("alpine-lake-copy")).toBe(1);
  });

  it("rolls everything back when the delete fails", async () => {
    // Make every trail delete fail
    sqlite.exec(`
      CREATE TRIGGER block BEFORE DELETE ON trails
      BEGIN SELECT RAISE(ABORT, 'blocked'); END
    `);
    const merge = mergeTrails("alpine-lake-copy", "alpine-lake");
    await expect(merge).rejects.toThrow("blocked");
    expect(reviewsOf("alpine-lake")).toBe(3);
    expect(reviewsOf("alpine-lake-copy")).toBe(1);
  });
});
