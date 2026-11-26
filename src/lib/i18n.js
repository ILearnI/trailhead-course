// The languages of the site
export const locales = ["en", "fr", "es"];
export const defaultLocale = "en";

export const hasLocale = (value) => locales.includes(value);

// The best language: cookie, then browser
export function pickLocale({ cookie, acceptLanguage }) {
  if (hasLocale(cookie)) return cookie;
  const wanted = (acceptLanguage ?? "")
    .split(",")
    .map((part) => {
      const [tag, q = "q=1"] = part.trim().split(";");
      const weight = Number(q.replace("q=", ""));
      return { language: tag.slice(0, 2).toLowerCase(), weight };
    })
    .sort((a, b) => b.weight - a.weight);
  return wanted.find((item) => hasLocale(item.language))?.language ?? defaultLocale;
}
