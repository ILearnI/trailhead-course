import { beforeEach, describe, expect, it } from "vitest";
import { addReport, clearReports, listReports, reportSchema, scrub } from "./error-report";

describe("reportSchema", () => {
  it("accepts a small report", () => {
    expect(reportSchema.safeParse({ message: "Boom" }).success).toBe(true);
  });

  it("refuses a message that is too long", () => {
    expect(reportSchema.safeParse({ message: "x".repeat(501) }).success).toBe(false);
  });
});

describe("scrub", () => {
  it("keeps only the path", () => {
    expect(scrub("/trails?token=abc#top")).toBe("/trails");
  });
});

describe("the store", () => {
  beforeEach(clearReports);

  it("keeps the newest first", () => {
    addReport({ message: "one" });
    addReport({ message: "two" });
    expect(listReports().map((report) => report.message)).toEqual(["two", "one"]);
  });

  it("keeps at most fifty", () => {
    for (let i = 0; i < 60; i += 1) addReport({ message: `error ${i}` });
    expect(listReports()).toHaveLength(50);
  });
});
