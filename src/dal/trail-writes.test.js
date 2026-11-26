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

import { createTrail, deleteTrail, updateTrail } from "./trail-writes";

const data = { name: "Tarn Loop", region: "alps", level: "Easy", km: 4.5, description: "" };

function signIn(role) {
  const row = { name: "Ana", email: "ana@example.com", role };
  const user = state.db.insert(users).values(row).returning().get();
  state.session = { userId: user.id };
  return user;
}

beforeEach(() => {
  state.db = createTestDb().db;
  state.session = null;
});

describe("createTrail", () => {
  it("refuses a normal user, and writes nothing", async () => {
    signIn("user");
    await expect(createTrail(data)).rejects.toThrow("forbidden");
    expect(state.db.select().from(trails).all()).toHaveLength(0);
  });

  it("lets an editor create a trail, with a slug", async () => {
    signIn("editor");
    expect(await createTrail(data)).toEqual({ ok: true, slug: "tarn-loop" });
    const row = state.db.select().from(trails).get();
    expect(row).toMatchObject({ name: "Tarn Loop", description: null });
  });

  it("refuses a name that is taken", async () => {
    signIn("editor");
    await createTrail(data);
    const again = await createTrail(data);
    expect(again).toEqual({ ok: false, error: "A trail with this name exists" });
  });
});

describe("updateTrail", () => {
  it("updates the fields, and keeps the slug", async () => {
    signIn("editor");
    await createTrail(data);
    const result = await updateTrail("tarn-loop", { ...data, km: 6 });
    expect(result).toEqual({ ok: true, slug: "tarn-loop", replaced: null });
    expect(state.db.select().from(trails).get().km).toBe(6);
  });

  it("says which photo it replaced", async () => {
    signIn("editor");
    await createTrail({ ...data, photo: "first.png" });
    const result = await updateTrail("tarn-loop", { ...data, photo: "second.png" });
    expect(result.replaced).toBe("first.png");
    expect(state.db.select().from(trails).get().photo).toBe("second.png");
  });

  it("says when the trail does not exist", async () => {
    signIn("editor");
    expect(await updateTrail("nope", data)).toEqual({ ok: false, error: "No such trail" });
  });
});

describe("deleteTrail", () => {
  it("deletes the trail and its reviews", async () => {
    const user = signIn("editor");
    await createTrail(data);
    const trailId = state.db.select().from(trails).get().id;
    const text = "A fine walk, with views.";
    state.db.insert(reviews).values({ trailId, userId: user.id, rating: 5, text }).run();
    expect(await deleteTrail("tarn-loop")).toEqual({ ok: true, photo: null });
    expect(state.db.select().from(reviews).all()).toHaveLength(0);
  });
});
