import { describe, expect, it } from "vitest";
import { alternates } from "./alternates";

describe("alternates", () => {
  it("points the canonical link at the same language", () => {
    expect(alternates("fr", "/trails").canonical).toBe("/fr/trails");
  });

  it("lists the page in every language", () => {
    expect(alternates("en", "").languages).toEqual({
      en: "/en",
      fr: "/fr",
      es: "/es",
    });
  });
});
