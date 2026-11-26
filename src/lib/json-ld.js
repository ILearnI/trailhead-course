import { siteUrl } from "@/lib/site";

// The structured data of a trail
export function trailJsonLd(trail, reviews) {
  const data = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: trail.name,
    description: trail.description,
    url: `${siteUrl}/trails/${trail.slug}`,
    address: { "@type": "PostalAddress", addressRegion: trail.region },
  };
  if (reviews.length > 0) {
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    data.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: Number((total / reviews.length).toFixed(1)),
      reviewCount: reviews.length,
    };
  }
  return data;
}

// The structured data of a list of questions
export function faqJsonLd(questions) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

// The structured data of the whole site
export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Trailhead",
    url: siteUrl,
  };
}

// Safe inside a script tag: no raw less than sign
export function jsonLdText(data) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
