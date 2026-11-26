// @vitest-environment node
import { and, eq } from "drizzle-orm";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { reviews, trails, users } from "@/db/schema";
import { createTestDb } from "@/test/db";
import { seedTestDb } from "@/test/seed";

// The database, and who is signed in
const state = vi.hoisted(() => ({ db: null, userId: null }));
vi.mock("@/db", () => ({
  get db() {
    return state.db;
  },
}));
vi.mock("server-only", () => ({}));
vi.mock("@/dal/auth", () => ({
  verifySession: async () => ({ userId: state.userId }),
}));

import { deleteMyReview, listMyReviews } from "./my-reviews";

let ids;
beforeEach(() => {
  state.db = createTestDb().db;
  ids = seedTestDb(state.db).userId;
});

// The id of the review that a user wrote on a trail
function reviewOf(user, slug) {
  return state.db
    .select({ id: reviews.id })
    .from(reviews)
    .innerJoin(trails, eq(reviews.trailId, trails.id))
    .where(and(eq(reviews.userId, ids[user]), eq(trails.slug, slug)))
    .get().id;
}

describe("listMyReviews", () => {
  it("lists only the reviews of the signed in user", async () => {
    state.userId = ids.maya;
    const items = await listMyReviews();
    expect(items.map((item) => item.trail).sort()).toEqual([
      "Alpine Lake Loop",
      "Ridge Line Traverse",
      "Salt Marsh Walk",
    ]);
  });

  it("is empty for a user with no reviews", async () => {
    const lonely = state.db
      .insert(users)
      .values({ name: "Nina", email: "nina@example.com" })
      .returning()
      .get();
    state.userId = lonely.id;
    expect(await listMyReviews()).toEqual([]);
  });
});

describe("deleteMyReview", () => {
  it("deletes my review, and returns the slug of the trail", async () => {
    state.userId = ids.maya;
    const id = reviewOf("maya", "alpine-lake");
    expect(await deleteMyReview(id)).toBe("alpine-lake");
    expect(await listMyReviews()).toHaveLength(2);
  });

  it("refuses the review of somebody else", async () => {
    state.userId = ids.maya;
    const id = reviewOf("tom", "alpine-lake");
    expect(await deleteMyReview(id)).toBeNull();
    const row = state.db.select().from(reviews).where(eq(reviews.id, id)).get();
    expect(row).toBeDefined();
  });

  it("returns null for a review that does not exist", async () => {
    state.userId = ids.maya;
    expect(await deleteMyReview(99999)).toBeNull();
  });
});
