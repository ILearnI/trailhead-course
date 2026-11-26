import { describe, expect, it } from "vitest";
import { can, ROLE_NAMES } from "./permissions";

const ALL = [
  "review:create",
  "review:delete:own",
  "review:delete:any",
  "user:read",
  "user:set-role",
];

// What each role should be able to do
const EXPECTED = {
  user: ["review:create", "review:delete:own"],
  admin: ALL,
};

describe("permissions matrix", () => {
  for (const [role, allowed] of Object.entries(EXPECTED)) {
    for (const permission of ALL) {
      const yes = allowed.includes(permission);
      it(`${role} ${yes ? "can" : "cannot"} ${permission}`, () => {
        expect(can({ role }, permission)).toBe(yes);
      });
    }
  }

  it("denies a missing user and an unknown role", () => {
    expect(can(null, "review:create")).toBe(false);
    expect(can({ role: "owner" }, "review:create")).toBe(false);
  });

  it("has a test for every role", () => {
    expect(ROLE_NAMES.sort()).toEqual(Object.keys(EXPECTED).sort());
  });
});
