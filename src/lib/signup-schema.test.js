import { describe, expect, it } from "vitest";
import { signUpSchema } from "./signup-schema";

const valid = { name: "Maya Chen", email: "maya@example.com", password: "long-enough-1" };

describe("signUpSchema", () => {
  it("accepts a complete form", () => {
    expect(signUpSchema.safeParse(valid).success).toBe(true);
  });

  it("trims the name and lowercases the email", () => {
    const form = { ...valid, name: "  Maya ", email: " MAYA@Example.com " };
    expect(signUpSchema.parse(form)).toMatchObject({
      name: "Maya",
      email: "maya@example.com",
    });
  });

  it("refuses a short password, with a message", () => {
    const result = signUpSchema.safeParse({ ...valid, password: "short" });
    expect(result.error.issues[0].message).toBe("Use at least 8 characters");
  });
});
