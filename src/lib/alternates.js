import { locales } from "@/lib/i18n";

// The same page in every language
export const alternates = (lang, path) => ({
  canonical: `/${lang}${path}`,
  languages: Object.fromEntries(locales.map((l) => [l, `/${l}${path}`])),
});
