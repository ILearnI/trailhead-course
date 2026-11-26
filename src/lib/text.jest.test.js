import { slugify, formatKm } from "./text";

// Jest has globals: no import for
// describe, it and expect
describe("slugify", () => {
  it("lowercases and joins words with dashes", () => {
    expect(slugify("Cedar Falls")).toBe("cedar-falls");
  });

  it("removes extra spaces and punctuation", () => {
    expect(slugify("  Salt Marsh   Walk! ")).toBe("salt-marsh-walk");
  });
});

describe("formatKm", () => {
  it("shows meters under one kilometer", () => {
    expect(formatKm(0.5)).toBe("500 m");
  });
});
