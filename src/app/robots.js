import { siteUrl } from "@/lib/site";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Private pages and the api: not for search
      disallow: ["/account", "/admin", "/api/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
