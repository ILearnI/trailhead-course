import { describe, expect, it } from "vitest";
import { aiRateLimit, chatBodySchema, clientKey, lastQuestion, LIMITS } from "./ai-limits";

const message = (role, text) => ({ id: "m", role, parts: [{ type: "text", text }] });

describe("chatBodySchema", () => {
  it("accepts a short conversation", () => {
    const body = { messages: [message("user", "Hello")] };
    expect(chatBodySchema.safeParse(body).success).toBe(true);
  });

  it("refuses an empty conversation", () => {
    expect(chatBodySchema.safeParse({ messages: [] }).success).toBe(false);
  });

  it("refuses a conversation that is too long", () => {
    const many = Array.from({ length: LIMITS.maxMessages + 1 }, () => {
      return message("user", "x");
    });
    expect(chatBodySchema.safeParse({ messages: many }).success).toBe(false);
  });

  it("refuses a role that is not ours", () => {
    const body = { messages: [message("system", "x")] };
    expect(chatBodySchema.safeParse(body).success).toBe(false);
  });
});

describe("lastQuestion", () => {
  it("is the text of the last message of the visitor", () => {
    const messages = [message("user", "one"), message("assistant", "a"), message("user", "two")];
    expect(lastQuestion(messages)).toBe("two");
  });
});

describe("aiRateLimit", () => {
  const from = (address) => new Headers({ "x-forwarded-for": address });

  it("takes the first address of the chain", () => {
    expect(clientKey(from("1.1.1.1, 2.2.2.2"))).toBe("1.1.1.1");
  });

  it("allows ten calls, and refuses the eleventh", () => {
    const headers = from("3.3.3.3");
    for (let i = 0; i < LIMITS.perMinute; i += 1) {
      expect(aiRateLimit(headers, "test").ok).toBe(true);
    }
    const refused = aiRateLimit(headers, "test");
    expect(refused.ok).toBe(false);
    expect(refused.retryAfter).toBeGreaterThan(0);
  });

  it("counts each visitor apart", () => {
    expect(aiRateLimit(from("4.4.4.4"), "test").ok).toBe(true);
  });
});
