import { describe, expect, it } from "vitest";
import { assistantSystem } from "./assistant";

describe("assistantSystem", () => {
  it("sends the assistant to the tools", () => {
    expect(assistantSystem()).toContain("Use the tools");
  });

  it("forbids inventing a trail or a number", () => {
    expect(assistantSystem()).toContain("never invent");
  });
});
