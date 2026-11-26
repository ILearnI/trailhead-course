import { describe, expect, it } from "vitest";
import { describeRating, starLabel, summarize } from "./ratings";

const reviews = (...ratings) => ratings.map((rating) => ({ rating }));

describe("summarize", () => {
  it("has no average without reviews", () => {
    expect(summarize([])).toEqual({
      count: 0,
      average: null,
      distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    });
  });

  it("averages to one decimal", () => {
    expect(summarize(reviews(5, 4, 5)).average).toBe(4.7);
  });

  it("counts the reviews of each rating", () => {
    expect(summarize(reviews(5, 4, 5)).distribution).toEqual({
      1: 0,
      2: 0,
      3: 0,
      4: 1,
      5: 2,
    });
  });
});

describe("describeRating", () => {
  it("says that there are no reviews yet", () => {
    expect(describeRating({ count: 0, average: null })).toBe("No reviews yet");
  });

  it("uses the singular for one review", () => {
    const text = describeRating({ count: 1, average: 5 });
    expect(text).toBe("Rated 5 out of 5, from 1 review");
  });

  it("gives the average and the count", () => {
    const text = describeRating({ count: 2, average: 3.5 });
    expect(text).toBe("Rated 3.5 out of 5, from 2 reviews");
  });
});

describe("starLabel", () => {
  it("uses the singular for one star", () => {
    expect(starLabel(1)).toBe("1 star");
  });

  it("uses the plural for the others", () => {
    expect(starLabel(4)).toBe("4 stars");
  });
});
