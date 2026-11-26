// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

// A fake cookie jar, that the module will use
const jar = vi.hoisted(() => ({ store: new Map(), options: null }));
vi.mock("server-only", () => ({}));
vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: (name) => (jar.store.has(name) ? { value: jar.store.get(name) } : undefined),
    set: (name, value, options) => {
      jar.store.set(name, value);
      jar.options = options;
    },
    delete: (name) => jar.store.delete(name),
  }),
}));

import { createSession, deleteSession, getSession } from "./session";

beforeEach(() => {
  jar.store.clear();
  jar.options = null;
});

describe("the session", () => {
  it("is empty without a cookie", async () => {
    expect(await getSession()).toBeNull();
  });

  it("is created, and read back", async () => {
    await createSession(7);
    expect(await getSession()).toEqual({ userId: 7 });
  });

  it("sets a safe cookie", async () => {
    await createSession(7);
    expect(jar.options).toMatchObject({ httpOnly: true, sameSite: "lax" });
    const days = (jar.options.expires - Date.now()) / 86_400_000;
    expect(Math.round(days)).toBe(7);
  });

  it("ignores a cookie that is not a token", async () => {
    jar.store.set("session", "forged");
    expect(await getSession()).toBeNull();
  });

  it("ends with deleteSession", async () => {
    await createSession(7);
    await deleteSession();
    expect(await getSession()).toBeNull();
  });
});
