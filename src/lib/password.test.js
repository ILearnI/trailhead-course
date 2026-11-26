// @vitest-environment node
import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "./password";

describe("hashPassword", () => {
  it("stores a salt and a key, in hex", async () => {
    const stored = await hashPassword("Trail-Pass-42");
    const [salt, key] = stored.split(":");
    expect(salt).toMatch(/^[0-9a-f]{32}$/);
    expect(key).toMatch(/^[0-9a-f]{128}$/);
  });

  it("never contains the password", async () => {
    expect(await hashPassword("Trail-Pass-42")).not.toContain("Trail-Pass-42");
  });

  it("gives a different result each time", async () => {
    const first = await hashPassword("Trail-Pass-42");
    const second = await hashPassword("Trail-Pass-42");
    expect(first).not.toBe(second);
  });
});

describe("verifyPassword", () => {
  it("accepts the right password", async () => {
    const stored = await hashPassword("Trail-Pass-42");
    expect(await verifyPassword("Trail-Pass-42", stored)).toBe(true);
  });

  it("refuses a wrong password", async () => {
    const stored = await hashPassword("Trail-Pass-42");
    expect(await verifyPassword("trail-pass-42", stored)).toBe(false);
    expect(await verifyPassword("", stored)).toBe(false);
  });

  it("refuses the hash of another password", async () => {
    const stored = await hashPassword("Another-Pass-7");
    expect(await verifyPassword("Trail-Pass-42", stored)).toBe(false);
  });
});
