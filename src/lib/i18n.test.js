import { describe, expect, it } from "vitest";
import { pickLocale } from "./i18n";

describe("pickLocale", () => {
  it("prefers the cookie", () => {
    expect(pickLocale({ cookie: "es", acceptLanguage: "fr" })).toBe("es");
  });

  it("reads the list of the browser, with its weights", () => {
    const header = "de;q=0.9, fr-FR;q=0.8, en;q=0.5";
    expect(pickLocale({ acceptLanguage: header })).toBe("fr");
  });

  it("falls back to the default language", () => {
    expect(pickLocale({ acceptLanguage: "de-DE,de;q=0.9" })).toBe("en");
    expect(pickLocale({})).toBe("en");
  });

  it("ignores a cookie that is not a language of the site", () => {
    expect(pickLocale({ cookie: "xx", acceptLanguage: "es" })).toBe("es");
  });
});
