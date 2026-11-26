import { describe, expect, it } from "vitest";
import { searchIntentSchema } from "./search-intent";

const none = { region: null, level: null, maxKm: null };

describe("searchIntentSchema", () => {
  it("accepts filters, and nulls for what is not said", () => {
    const intent = { region: "coast", level: null, maxKm: 5 };
    expect(searchIntentSchema.parse(intent)).toEqual(intent);
  });

  it("refuses a region that does not exist", () => {
    const result = searchIntentSchema.safeParse({ ...none, region: "moon" });
    expect(result.success).toBe(false);
  });

  it("refuses a negative length", () => {
    const result = searchIntentSchema.safeParse({ ...none, maxKm: -3 });
    expect(result.success).toBe(false);
  });
});
