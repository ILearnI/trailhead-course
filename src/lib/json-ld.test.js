import { describe, expect, it } from "vitest";
import { faqJsonLd, jsonLdText, trailJsonLd, websiteJsonLd } from "./json-ld";

const trail = {
  slug: "alpine-lake",
  name: "Alpine Lake Loop",
  description: "A loop around a glacial lake.",
  region: "alps",
};

describe("trailJsonLd", () => {
  it("has no rating without reviews", () => {
    expect(trailJsonLd(trail, [])).not.toHaveProperty("aggregateRating");
  });

  it("averages the ratings, and counts them", () => {
    const reviews = [{ rating: 5 }, { rating: 4 }, { rating: 4 }];
    const { aggregateRating } = trailJsonLd(trail, reviews);
    expect(aggregateRating).toMatchObject({ ratingValue: 4.3, reviewCount: 3 });
  });
});

describe("jsonLdText", () => {
  it("never contains a raw less than sign", () => {
    const evil = { name: "</script><script>alert(1)</script>" };
    const text = jsonLdText(evil);
    expect(text).not.toContain("<");
    expect(JSON.parse(text)).toEqual(evil);
  });
});

describe("faqJsonLd", () => {
  it("makes a question and an answer for each item", () => {
    const data = faqJsonLd([{ q: "Is it free?", a: "Yes." }]);
    expect(data["@type"]).toBe("FAQPage");
    expect(data.mainEntity[0]).toMatchObject({
      name: "Is it free?",
      acceptedAnswer: { text: "Yes." },
    });
  });
});

describe("websiteJsonLd", () => {
  it("names the site", () => {
    expect(websiteJsonLd()).toMatchObject({ "@type": "WebSite", name: "Trailhead" });
  });
});
