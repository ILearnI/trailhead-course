// Formats in the language of the reader
export const formatDistance = (km, locale) =>
  new Intl.NumberFormat(locale, {
    style: "unit",
    unit: "kilometer",
    maximumFractionDigits: 1,
  }).format(km);

export const formatDate = (date, locale) =>
  new Intl.DateTimeFormat(locale, { dateStyle: "long", timeZone: "UTC" }).format(date);

export const formatList = (items, locale) =>
  new Intl.ListFormat(locale, { style: "long", type: "conjunction" }).format(items);

// The right form of a text, for a number
export function plural(locale, count, forms) {
  const rule = new Intl.PluralRules(locale).select(count);
  return forms[rule] ?? forms.other;
}

// Fills a text: {name} becomes the value
export const fill = (text, values) =>
  text.replace(/\{(\w+)\}/g, (_, key) => values[key] ?? "");
