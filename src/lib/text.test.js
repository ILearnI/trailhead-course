import { describe, it, test, expect } from "vitest";
import { slugify, formatKm } from "./text";

describe("slugify", () => {
  it("lowercases and joins words with dashes", () => {
    expect(slugify("Cedar Falls")).toBe("cedar-falls");
  });
});

// Each row: an input and its slug
test.each([
  ["Cedar Falls", "cedar-falls"],
  ["  Pine   Hollow ", "pine-hollow"],
  ["Salt Marsh Walk!", "salt-marsh-walk"],
  ["", ""],
])("slugify(%j) is %j", (input, expected) => {
  expect(slugify(input)).toBe(expected);
});

describe("formatKm", () => {
  it("shows kilometers", () => {
    expect(formatKm(8.4)).toBe("8.4 km");
  });

  it("shows meters under one kilometer", () => {
    expect(formatKm(0.5)).toBe("500 m");
  });

  it("throws for a negative distance", () => {
    expect(() => formatKm(-1)).toThrow("negative");
  });
});
