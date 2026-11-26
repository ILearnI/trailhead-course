// @vitest-environment node
import { eq } from "drizzle-orm";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { updateTag } from "next/cache";
import { reviews } from "@/db/schema";
import { createTestDb } from "@/test/db";
import { formData } from "@/test/form";
import { seedTestDb } from "@/test/seed";
import { tags } from "@/lib/tags";

// The database and the session of the layer
const state = vi.hoisted(() => ({ db: null, session: null }));
vi.mock("@/db", () => ({
  get db() {
    return state.db;
  },
}));
vi.mock("server-only", () => ({}));
vi.mock("@/lib/session", () => ({ getSession: async () => state.session }));
vi.mock("next/cache", () => ({
  updateTag: vi.fn(),
  cacheLife: vi.fn(),
  cacheTag: vi.fn(),
}));
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

import { postReview } from "./actions";

let ids;
beforeEach(() => {
  state.db = createTestDb().db;
  ids = seedTestDb(state.db).userId;
  state.session = null;
  vi.clearAllMocks();
});

const total = () => state.db.select().from(reviews).all().length;
const valid = { slug: "alpine-lake", rating: 4, text: "A lovely trail, very quiet." };

describe("postReview", () => {
  it("sends a visitor to the login, and saves nothing", async () => {
    const before = total();
    await expect(postReview(formData(valid))).rejects.toThrow("redirect /login");
    expect(total()).toBe(before);
  });

  it("saves the review of a signed in user, with their id", async () => {
    state.session = { userId: ids.ines };
    await postReview(formData(valid));
    const saved = state.db.select().from(reviews).where(eq(reviews.text, valid.text)).get();
    expect(saved).toMatchObject({ userId: ids.ines, rating: 4 });
  });

  it("refuses a rating outside 1 to 5", async () => {
    state.session = { userId: ids.ines };
    const before = total();
    await postReview(formData({ ...valid, rating: 9 }));
    expect(total()).toBe(before);
  });

  it("refuses a text that is too short", async () => {
    state.session = { userId: ids.ines };
    const before = total();
    await postReview(formData({ ...valid, text: "Nice" }));
    expect(total()).toBe(before);
  });

  it("ends the reviews of the trail and the ranking", async () => {
    state.session = { userId: ids.ines };
    await postReview(formData(valid));
    expect(updateTag).toHaveBeenCalledWith(tags.reviews("alpine-lake"));
    expect(updateTag).toHaveBeenCalledWith(tags.ranking);
    expect(updateTag).toHaveBeenCalledTimes(2);
  });

  it("ends nothing when the review is refused", async () => {
    state.session = { userId: ids.ines };
    await postReview(formData({ ...valid, rating: 9 }));
    expect(updateTag).not.toHaveBeenCalled();
  });

  it("ends nothing for a visitor", async () => {
    await expect(postReview(formData(valid))).rejects.toThrow("redirect");
    expect(updateTag).not.toHaveBeenCalled();
  });
});
