// @vitest-environment node
import { and, eq } from "drizzle-orm";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { reviews, trails } from "@/db/schema";
import { createTestDb } from "@/test/db";
import { formData } from "@/test/form";
import { seedTestDb } from "@/test/seed";

// The database and the session of the layer
const state = vi.hoisted(() => ({ db: null, session: null }));
vi.mock("@/db", () => ({
  get db() {
    return state.db;
  },
}));
vi.mock("server-only", () => ({}));
vi.mock("@/lib/session", () => ({ getSession: async () => state.session }));
vi.mock("next/cache", () => ({ updateTag: vi.fn() }));
vi.mock("next/navigation", () => ({
  redirect: (url) => {
    throw new Error(`redirect ${url}`);
  },
  forbidden: () => {
    throw new Error("forbidden");
  },
  unauthorized: () => {
    throw new Error("unauthorized");
  },
}));

import { updateTag } from "next/cache";
import { removeMyReview } from "./actions";

let ids;
beforeEach(() => {
  state.db = createTestDb().db;
  ids = seedTestDb(state.db).userId;
  state.session = null;
  vi.mocked(updateTag).mockClear();
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
const exists = (id) =>
  state.db.select().from(reviews).where(eq(reviews.id, id)).get() !== undefined;

describe("removeMyReview", () => {
  it("sends a visitor to the login, and deletes nothing", async () => {
    const id = reviewOf("maya", "alpine-lake");
    await expect(removeMyReview(formData({ id }))).rejects.toThrow("redirect /login");
    expect(exists(id)).toBe(true);
  });

  it("deletes my review, and expires its tags", async () => {
    state.session = { userId: ids.maya };
    const id = reviewOf("maya", "alpine-lake");
    await removeMyReview(formData({ id }));
    expect(exists(id)).toBe(false);
    expect(updateTag).toHaveBeenCalledWith("reviews:alpine-lake");
    expect(updateTag).toHaveBeenCalledWith("ranking");
  });

  it("keeps the review of somebody else, and expires nothing", async () => {
    state.session = { userId: ids.maya };
    const id = reviewOf("tom", "alpine-lake");
    await removeMyReview(formData({ id }));
    expect(exists(id)).toBe(true);
    expect(updateTag).not.toHaveBeenCalled();
  });

  it("ignores an id that is not a number", async () => {
    state.session = { userId: ids.maya };
    await removeMyReview(formData({ id: "abc" }));
    expect(updateTag).not.toHaveBeenCalled();
  });
});
