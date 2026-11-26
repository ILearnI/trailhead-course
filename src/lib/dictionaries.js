import "server-only";

// Each language is loaded only when it is asked for
const dictionaries = {
  en: () => import("@/dictionaries/en.json").then((m) => m.default),
  fr: () => import("@/dictionaries/fr.json").then((m) => m.default),
  es: () => import("@/dictionaries/es.json").then((m) => m.default),
};

export const getDictionary = async (locale) => dictionaries[locale]();
