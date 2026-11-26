// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import { reviews, trails, users } from "@/db/schema";
import { createTestDb } from "@/test/db";

const state = vi.hoisted(() => ({ db: null, session: null }));
vi.mock("@/db", () => ({
  get db() {
    return state.db;
  },
}));
vi.mock("server-only", () => ({}));
vi.mock("@/lib/session", () => ({ getSession: async () => state.session }));
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

import { deleteReview, listRecentReviews } from "./moderation";

function setUp(role) {
  const row = { name: "Ana", email: "ana@example.com", role };
  const user = state.db.insert(users).values(row).returning().get();
  state.session = { userId: user.id };
  const trail = { slug: "a", name: "Alpha", region: "alps", level: "Easy", km: 3 };
  const [first] = state.db.insert(trails).values(trail).returning().all();
  const make = (text) => ({ trailId: first.id, userId: user.id, rating: 4, text });
  const rows = [make("First, a fine walk."), make("Second, a fine walk.")];
  state.db.insert(reviews).values(rows).run();
}

beforeEach(() => {
  state.db = createTestDb().db;
  state.session = null;
});

describe("listRecentReviews", () => {
  it("refuses a normal user", async () => {
    setUp("user");
    await expect(listRecentReviews()).rejects.toThrow("forbidden");
  });

  it("lists the reviews for an editor, with trail and author", async () => {
    setUp("editor");
    const items = await listRecentReviews();
    expect(items).toHaveLength(2);
    expect(items[0]).toMatchObject({ trail: "Alpha", author: "Ana" });
  });
});

describe("deleteReview", () => {
  it("refuses a normal user, and deletes nothing", async () => {
    setUp("user");
    await expect(deleteReview(1)).rejects.toThrow("forbidden");
    expect(state.db.select().from(reviews).all()).toHaveLength(2);
  });

  it("removes a review, and says which trail", async () => {
    setUp("editor");
    expect(await deleteReview(1)).toEqual({ ok: true, slug: "a" });
    expect(state.db.select().from(reviews).all()).toHaveLength(1);
  });

  it("fails cleanly for an unknown review", async () => {
    setUp("editor");
    expect(await deleteReview(99)).toEqual({ ok: false });
  });
});
