import { trailText } from "@/data/trail-text";

// A description, with the language of its text
export function describeTrail(trail, lang) {
  const text = trailText[trail.slug]?.[lang];
  return text ? { text, lang } : { text: trail.description, lang: "en" };
}
