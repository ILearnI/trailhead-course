// @vitest-environment node
import { eq } from "drizzle-orm";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { users } from "@/db/schema";
import { createTestDb } from "@/test/db";
import { formData } from "@/test/form";

// The database and the session of the layer
const state = vi.hoisted(() => ({ db: null, session: null }));
vi.mock("@/db", () => ({
  get db() {
    return state.db;
  },
}));
vi.mock("server-only", () => ({}));
vi.mock("@/lib/session", () => ({ getSession: async () => state.session }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
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

import { revalidatePath } from "next/cache";
import { changeRole } from "./actions";

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
  vi.mocked(revalidatePath).mockClear();
});

describe("changeRole", () => {
  it("sends a visitor to the login, and changes nothing", async () => {
    const target = makeUser("user");
    const input = formData({ id: target.id, role: "admin" });
    await expect(changeRole(input)).rejects.toThrow("redirect /login");
    expect(roleOf(target.id)).toBe("user");
  });

  it("refuses a normal user, and changes nothing", async () => {
    const me = makeUser("user", true);
    const input = formData({ id: me.id, role: "admin" });
    await expect(changeRole(input)).rejects.toThrow("forbidden");
    expect(roleOf(me.id)).toBe("user");
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("lets an admin change a role, and refreshes the page", async () => {
    const target = makeUser("user");
    makeUser("admin", true);
    await changeRole(formData({ id: target.id, role: "admin" }));
    expect(roleOf(target.id)).toBe("admin");
    expect(revalidatePath).toHaveBeenCalledWith("/admin");
  });

  it("ignores a role that does not exist", async () => {
    const target = makeUser("user");
    makeUser("admin", true);
    await changeRole(formData({ id: target.id, role: "owner" }));
    expect(roleOf(target.id)).toBe("user");
    expect(revalidatePath).not.toHaveBeenCalled();
  });
});
