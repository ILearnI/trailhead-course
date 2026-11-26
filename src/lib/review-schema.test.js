import { describe, it, test, expect } from "vitest";
import { z } from "zod";
import { reviewSchema } from "./review-schema";

// A valid review, that each test can change
const valid = {
  trail: "alpine-lake",
  name: "Ada",
  rating: "5",
  text: "Clear water, easy to follow.",
};

// The errors by field, for a changed review
function errorsFor(changes) {
  const result = reviewSchema.safeParse({ ...valid, ...changes });
  return result.success ? {} : z.flattenError(result.error).fieldErrors;
}

describe("reviewSchema", () => {
  it("accepts a valid review, and turns the rating into a number", () => {
    const result = reviewSchema.safeParse(valid);
    expect(result.success).toBe(true);
    expect(result.data.rating).toBe(5);
  });

  it("trims the text", () => {
    const result = reviewSchema.safeParse({ ...valid, text: "  padded text here  " });
    expect(result.data.text).toBe("padded text here");
  });
});

// Each row: a label, a change, a field, a message
test.each([
  ["a one letter name", { name: "A" }, "name", "Enter your name"],
  ["a blank name", { name: "   " }, "name", "Enter your name"],
  ["a decimal rating", { rating: "5.5" }, "rating", "Choose a whole number"],
  ["a rating of zero", { rating: "0" }, "rating", "Rate from 1 to 5"],
  ["a rating of six", { rating: "6" }, "rating", "Rate from 1 to 5"],
  ["a rating that is a word", { rating: "abc" }, "rating", "Rate from 1 to 5"],
  ["a short text", { text: "Nice" }, "text", "Write at least 10 characters"],
])("rejects %s", (label, changes, field, message) => {
  expect(errorsFor(changes)[field]).toEqual([message]);
});

// Each row: a length, and if it is accepted
test.each([
  [9, false],
  [10, true],
  [400, true],
  [401, false],
])("a text of %i characters: accepted is %s", (length, accepted) => {
  const errors = errorsFor({ text: "x".repeat(length) });
  expect("text" in errors).toBe(!accepted);
});

test("reports every problem at once", () => {
  const errors = errorsFor({ name: "A", rating: "9", text: "Hi" });
  expect(Object.keys(errors).sort()).toEqual(["name", "rating", "text"]);
});
