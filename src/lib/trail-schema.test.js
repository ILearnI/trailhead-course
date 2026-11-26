import { describe, expect, it } from "vitest";
import { trailSchema } from "./trail-schema";

const valid = {
  name: "Tarn Loop",
  region: "alps",
  level: "Easy",
  km: "4.5",
  description: "",
};
const parse = (changes) => trailSchema.safeParse({ ...valid, ...changes });
const messages = (result) => Object.values(result.error.issues).map((i) => i.message);

describe("trailSchema", () => {
  it("accepts a valid form, and makes km a number", () => {
    const result = parse({});
    expect(result.success).toBe(true);
    expect(result.data.km).toBe(4.5);
  });

  it("refuses a short name", () => {
    expect(messages(parse({ name: "ab" }))).toContain("At least 3 letters");
  });

  it("refuses a name without letters", () => {
    expect(messages(parse({ name: "!!!" }))).toContain("Use letters or digits");
  });

  it("refuses an unknown region", () => {
    expect(messages(parse({ region: "moon" }))).toContain("Pick a region");
  });

  it("refuses a bad distance", () => {
    expect(messages(parse({ km: "far" }))).toContain("Enter a number");
    expect(messages(parse({ km: "-2" }))).toContain("More than 0 km");
    expect(messages(parse({ km: "900" }))).toContain("At most 500 km");
  });
});
