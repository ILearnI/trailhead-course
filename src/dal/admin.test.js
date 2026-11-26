// @vitest-environment node
import { eq } from "drizzle-orm";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { users } from "@/db/schema";
import { createTestDb } from "@/test/db";

// The database and the session of the layer
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

import { listUsers, setRole } from "./admin";

let count = 0;
// A user, signed in when login is true
function makeUser(role, login = false) {
  count += 1;
  const user = state.db
    .insert(users)
    .values({ name: `Person ${count}`, email: `p${count}@example.com`, role })
    .returning()
    .get();
  if (login) state.session = { userId: user.id };
  return user;
}

const roleOf = (id) =>
  state.db.select().from(users).where(eq(users.id, id)).get().role;

beforeEach(() => {
  state.db = createTestDb().db;
  state.session = null;
});

describe("listUsers", () => {
  it("refuses a normal user", async () => {
    makeUser("user", true);
    await expect(listUsers()).rejects.toThrow("forbidden");
  });

  it("lists everybody for an admin", async () => {
    makeUser("user");
    makeUser("admin", true);
    expect(await listUsers()).toHaveLength(2);
  });
});

describe("setRole", () => {
  it("refuses a normal user, and changes nothing", async () => {
    const me = makeUser("user", true);
    await expect(setRole(me.id, "admin")).rejects.toThrow("forbidden");
    expect(roleOf(me.id)).toBe("user");
  });

  it("lets an admin promote a user", async () => {
    const target = makeUser("user");
    makeUser("admin", true);
    expect(await setRole(target.id, "admin")).toEqual({ ok: true });
    expect(roleOf(target.id)).toBe("admin");
  });

  it("keeps at least one admin", async () => {
    const only = makeUser("admin", true);
    const result = await setRole(only.id, "user");
    expect(result).toEqual({ ok: false, error: "Keep at least one admin" });
    expect(roleOf(only.id)).toBe("admin");
  });

  it("can demote an admin when another one exists", async () => {
    const other = makeUser("admin");
    makeUser("admin", true);
    expect(await setRole(other.id, "user")).toEqual({ ok: true });
  });

  it("reports an unknown user", async () => {
    makeUser("admin", true);
    expect(await setRole(9999, "user")).toEqual({ ok: false, error: "No such user" });
  });
});
