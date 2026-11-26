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
vi.mock("next/cache", () => ({ cacheLife: vi.fn(), cacheTag: vi.fn() }));
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

import { getStudioStats } from "./studio-stats";

const DAY = 24 * 60 * 60 * 1000;

function setUp(role) {
  const user = state.db
    .insert(users)
    .values({ name: "Ana", email: "ana@example.com", role })
    .returning()
    .get();
  state.session = { userId: user.id };
  const [first] = state.db
    .insert(trails)
    .values([
      { slug: "a", name: "Alpha", region: "alps", level: "Easy", km: 3 },
      { slug: "b", name: "Beta", region: "coast", level: "Hard", km: 9 },
    ])
    .returning()
    .all();
  return { user, first };
}

beforeEach(() => {
  state.db = createTestDb().db;
  state.session = null;
});

describe("getStudioStats", () => {
  it("refuses a normal user", async () => {
    setUp("user");
    await expect(getStudioStats()).rejects.toThrow("forbidden");
  });

  it("counts for an editor", async () => {
    const { user, first } = setUp("editor");
    const rows = [5, 4, 3].map((rating) => ({
      trailId: first.id,
      userId: user.id,
      rating,
      text: "A fine walk, with views.",
    }));
    state.db.insert(reviews).values(rows).run();
    const stats = await getStudioStats();
    expect(stats).toMatchObject({ trails: 2, reviews: 3, average: 4, unreviewed: 1 });
    expect(stats.top[0]).toMatchObject({ slug: "a", reviews: 3, average: 4 });
  });

  it("counts only the last seven days in the week", async () => {
    const { user, first } = setUp("admin");
    const old = new Date(Date.now() - 30 * DAY);
    const text = "A fine walk, with views.";
    const values = { trailId: first.id, userId: user.id, rating: 5, text };
    state.db.insert(reviews).values([values, { ...values, createdAt: old }]).run();
    const stats = await getStudioStats();
    expect(stats).toMatchObject({ reviews: 2, lastWeek: 1 });
  });

  it("has no average without reviews", async () => {
    setUp("editor");
    const stats = await getStudioStats();
    expect(stats).toMatchObject({ reviews: 0, average: null, unreviewed: 2 });
  });
});
