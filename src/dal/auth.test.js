// @vitest-environment node
import { eq } from "drizzle-orm";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { users } from "@/db/schema";
import { createTestDb } from "@/test/db";
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

// The interrupts become plain errors
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

import { getCurrentUser, requirePermission, verifySession } from "./auth";

let ids;
beforeEach(() => {
  state.db = createTestDb().db;
  ids = seedTestDb(state.db).userId;
  state.session = null;
});

describe("verifySession", () => {
  it("sends a visitor to the login", async () => {
    await expect(verifySession()).rejects.toThrow("redirect /login");
  });

  it("returns the user id of a session", async () => {
    state.session = { userId: ids.maya };
    expect(await verifySession()).toEqual({ userId: ids.maya });
  });
});

describe("getCurrentUser", () => {
  it("returns the user, without a password hash", async () => {
    state.session = { userId: ids.maya };
    const user = await getCurrentUser();
    expect(user).toMatchObject({ name: "Maya Chen", role: "user" });
    expect(user).not.toHaveProperty("passwordHash");
  });

  it("refuses a session of a user who does not exist", async () => {
    state.session = { userId: 9999 };
    await expect(getCurrentUser()).rejects.toThrow("unauthorized");
  });
});

describe("requirePermission", () => {
  it("refuses a user without the permission", async () => {
    state.session = { userId: ids.maya };
    await expect(requirePermission("user:read")).rejects.toThrow("forbidden");
  });

  it("allows an admin, and returns the user", async () => {
    state.db.update(users).set({ role: "admin" }).where(eq(users.id, ids.maya)).run();
    state.session = { userId: ids.maya };
    const user = await requirePermission("user:read");
    expect(user.role).toBe("admin");
  });

  it("sends a visitor to the login, not to a 403", async () => {
    await expect(requirePermission("user:read")).rejects.toThrow("redirect /login");
  });
});
