import { describe, expect, it } from "vitest";
import { fill, formatDate, formatDistance, formatList, plural } from "./format";

describe("formatDistance", () => {
  it("follows the decimal mark of the language", () => {
    expect(formatDistance(8.4, "en")).toMatch(/^8\.4\s?km$/);
    expect(formatDistance(8.4, "fr")).toMatch(/^8,4\s?km$/);
  });
});

describe("formatDate", () => {
  it("writes the same day in three languages", () => {
    const day = new Date("2027-03-20T12:00:00Z");
    expect(formatDate(day, "en")).toBe("March 20, 2027");
    expect(formatDate(day, "fr")).toBe("20 mars 2027");
    expect(formatDate(day, "es")).toBe("20 de marzo de 2027");
  });
});

describe("formatList", () => {
  it("puts the word before the last item", () => {
    expect(formatList(["a", "b", "c"], "en")).toBe("a, b, and c");
    expect(formatList(["a", "b", "c"], "fr")).toBe("a, b et c");
  });
});

describe("plural and fill", () => {
  const forms = { one: "{count} trail", other: "{count} trails" };

  it("follows the rules of the language", () => {
    expect(plural("en", 0, forms)).toBe(forms.other);
    expect(plural("fr", 0, forms)).toBe(forms.one);
  });

  it("fills the values in a text", () => {
    expect(fill(forms.other, { count: 7 })).toBe("7 trails");
  });
});
