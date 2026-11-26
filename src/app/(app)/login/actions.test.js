// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import { users } from "@/db/schema";
import { hashPassword } from "@/lib/password";
import { createTestDb } from "@/test/db";
import { formData } from "@/test/form";

// The database, and the session module
const state = vi.hoisted(() => ({ db: null }));
vi.mock("@/db", () => ({
  get db() {
    return state.db;
  },
}));
vi.mock("server-only", () => ({}));
vi.mock("@/lib/session", () => ({
  createSession: vi.fn(),
  deleteSession: vi.fn(),
}));
vi.mock("next/navigation", () => ({
  redirect: (url) => {
    throw new Error(`redirect ${url}`);
  },
}));

import { createSession } from "@/lib/session";
import { login } from "./actions";

let maya;
beforeEach(async () => {
  state.db = createTestDb().db;
  // A new count of attempts, for each test
  globalThis.rateLimitAttempts?.clear();
  vi.mocked(createSession).mockClear();
  maya = state.db
    .insert(users)
    .values({
      name: "Maya",
      email: "maya@example.com",
      passwordHash: await hashPassword("Trail-Pass-42"),
    })
    .returning()
    .get();
});

const attempt = (email, password) => login({}, formData({ email, password }));

describe("login", () => {
  it("signs in with the right password, and goes to the account", async () => {
    const result = attempt("maya@example.com", "Trail-Pass-42");
    await expect(result).rejects.toThrow("redirect /account");
    expect(createSession).toHaveBeenCalledWith(maya.id);
  });

  it("gives the same answer for a wrong password and an unknown email", async () => {
    const wrong = await attempt("maya@example.com", "nope");
    const unknown = await attempt("nobody@example.com", "nope");
    expect(wrong.error).toBe("Wrong email or password");
    expect(unknown.error).toBe(wrong.error);
    expect(createSession).not.toHaveBeenCalled();
  });

  it("stops after five attempts, even for the right password", async () => {
    for (let i = 0; i < 5; i += 1) await attempt("maya@example.com", "nope");
    const sixth = await attempt("maya@example.com", "Trail-Pass-42");
    expect(sixth.error).toMatch(/Too many attempts/);
    expect(createSession).not.toHaveBeenCalled();
  });

  it("counts each email on its own", async () => {
    for (let i = 0; i < 5; i += 1) await attempt("maya@example.com", "nope");
    const other = await attempt("nobody@example.com", "nope");
    expect(other.error).toBe("Wrong email or password");
  });
});
