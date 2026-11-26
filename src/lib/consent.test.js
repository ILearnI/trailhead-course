import { describe, expect, it } from "vitest";
import { consentCookie, privacySignal, readConsent } from "./consent";

describe("readConsent", () => {
  it("reads yes, no, or nothing", () => {
    expect(readConsent("a=1; consent=yes; b=2")).toBe("yes");
    expect(readConsent("consent=no")).toBe("no");
    expect(readConsent("a=1")).toBeUndefined();
  });

  it("is not fooled by another cookie", () => {
    expect(readConsent("myconsent=yes")).toBeUndefined();
  });
});

describe("consentCookie and privacySignal", () => {
  it("lasts a year, on the whole site", () => {
    expect(consentCookie("yes")).toBe(
      "consent=yes; Path=/; Max-Age=31536000; SameSite=Lax",
    );
  });

  it("obeys do not track and global privacy control", () => {
    expect(privacySignal({ doNotTrack: "1" })).toBe(true);
    expect(privacySignal({ globalPrivacyControl: true })).toBe(true);
    expect(privacySignal({ doNotTrack: "0" })).toBe(false);
  });
});
