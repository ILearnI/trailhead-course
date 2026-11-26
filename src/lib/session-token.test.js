// @vitest-environment node
import { SignJWT } from "jose";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cookieOptions, isOld, readToken, signToken, WEEK } from "./session-token";

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
});

describe("signToken and readToken", () => {
  it("returns the user id of a valid token", async () => {
    const token = await signToken(7);
    const payload = await readToken(token);
    expect(payload.userId).toBe(7);
  });

  it("expires after a week", async () => {
    vi.useFakeTimers();
    const token = await signToken(7);
    vi.setSystemTime(Date.now() + WEEK - 60_000);
    expect(await readToken(token)).not.toBeNull();
    vi.setSystemTime(Date.now() + 120_000);
    expect(await readToken(token)).toBeNull();
  });

  it("refuses a tampered token", async () => {
    const [header, , signature] = (await signToken(7)).split(".");
    const body = JSON.stringify({ userId: 1 });
    const forged = Buffer.from(body).toString("base64url");
    expect(await readToken(`${header}.${forged}.${signature}`)).toBeNull();
  });

  it("refuses a token signed with another key", async () => {
    const other = new TextEncoder().encode("another-secret-0123456789abcdef");
    const token = await new SignJWT({ userId: 1 })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1h")
      .sign(other);
    expect(await readToken(token)).toBeNull();
  });

  it("refuses garbage", async () => {
    expect(await readToken("not-a-token")).toBeNull();
    expect(await readToken("")).toBeNull();
  });
});

describe("isOld", () => {
  it("is false for a fresh token, true after half of its life", async () => {
    vi.useFakeTimers();
    const payload = await readToken(await signToken(7));
    expect(isOld(payload)).toBe(false);
    vi.setSystemTime(Date.now() + WEEK / 2 + 60_000);
    expect(isOld(payload)).toBe(true);
  });
});

describe("cookieOptions", () => {
  it("is httpOnly, lax and for the whole site", () => {
    const options = cookieOptions(new Date());
    expect(options).toMatchObject({ httpOnly: true, sameSite: "lax", path: "/" });
  });

  it("is secure only in production", () => {
    expect(cookieOptions(new Date()).secure).toBe(false);
    vi.stubEnv("NODE_ENV", "production");
    expect(cookieOptions(new Date()).secure).toBe(true);
  });
});
