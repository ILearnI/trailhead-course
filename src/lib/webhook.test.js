import { describe, expect, it } from "vitest";
import { signBody, verifySignature } from "./webhook";

const SECRET = "test-webhook-secret";
const BODY = '{"type":"trails.updated"}';

describe("signBody", () => {
  it("makes sha256= and 64 hex characters", () => {
    expect(signBody(SECRET, BODY)).toMatch(/^sha256=[0-9a-f]{64}$/);
  });

  it("is always the same for the same body and secret", () => {
    expect(signBody(SECRET, BODY)).toBe(signBody(SECRET, BODY));
  });

  it("changes with the body, and with the secret", () => {
    const base = signBody(SECRET, BODY);
    expect(signBody(SECRET, `${BODY} `)).not.toBe(base);
    expect(signBody("another-secret", BODY)).not.toBe(base);
  });
});

describe("verifySignature", () => {
  it("accepts the right signature", () => {
    expect(verifySignature(SECRET, BODY, signBody(SECRET, BODY))).toBe(true);
  });

  it("refuses a body that was changed after signing", () => {
    const signature = signBody(SECRET, BODY);
    expect(verifySignature(SECRET, '{"type":"trails.deleted"}', signature)).toBe(false);
  });

  it("refuses a signature made with another secret", () => {
    const forged = signBody("another-secret", BODY);
    expect(verifySignature(SECRET, BODY, forged)).toBe(false);
  });

  it("refuses a missing signature, and a missing secret", () => {
    expect(verifySignature(SECRET, BODY, null)).toBe(false);
    expect(verifySignature("", BODY, signBody("", BODY))).toBe(false);
    expect(verifySignature(undefined, BODY, signBody(SECRET, BODY))).toBe(false);
  });

  it("refuses a signature of the wrong length, without throwing", () => {
    expect(verifySignature(SECRET, BODY, "sha256=abc")).toBe(false);
    expect(verifySignature(SECRET, BODY, "")).toBe(false);
  });
});
