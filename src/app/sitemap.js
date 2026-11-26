import { trails as published } from "@/data/trails";
import { listTrails } from "@/dal/trails";
import { siteUrl } from "@/lib/site";
import { locales } from "@/lib/i18n";

// The trails that have a page
const withPage = new Set(published.map((trail) => trail.slug));

// The pages that search engines should know
export default async function sitemap() {
  const trails = await listTrails();
  const paths = ["", "/trails", "/about", "/contact", "/faq", "/privacy", "/terms"];
  const pages = paths.map((path) => ({
    url: `${siteUrl}${path}`,
    changeFrequency: "monthly",
  }));
  // Each translated page, with its other languages
  const translated = ["", "/trails"].flatMap((path) =>
    locales.map((lang) => ({
      url: `${siteUrl}/${lang}${path}`,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${siteUrl}/${l}${path}`]),
        ),
      },
    })),
  );
  const details = trails.filter((t) => withPage.has(t.slug)).map((trail) => ({
    url: `${siteUrl}/trails/${trail.slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));
  return [...pages, ...translated, ...details];
}
