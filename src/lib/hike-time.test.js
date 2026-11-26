import { describe, expect, it } from "vitest";
import { estimateMinutes, formatDuration } from "./hike-time";

describe("estimateMinutes", () => {
  it("walks an easy trail at 4 km an hour", () => {
    expect(estimateMinutes({ km: 4, level: "Easy" })).toBe(60);
  });

  it("walks a moderate trail more slowly", () => {
    expect(estimateMinutes({ km: 6, level: "Moderate" })).toBe(120);
  });

  it("walks a hard trail more slowly still", () => {
    expect(estimateMinutes({ km: 5, level: "Hard" })).toBe(120);
  });

  it("rounds up to the next 5 minutes", () => {
    expect(estimateMinutes({ km: 4.2, level: "Easy" })).toBe(65);
  });
});

describe("formatDuration", () => {
  it("shows hours and minutes", () => {
    expect(formatDuration(95)).toBe("1 h 35 min");
  });

  it("shows only minutes under an hour", () => {
    expect(formatDuration(45)).toBe("45 min");
  });

  it("shows only hours when the minutes are zero", () => {
    expect(formatDuration(120)).toBe("2 h");
  });
});
