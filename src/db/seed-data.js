// A sentence for each trail
export const descriptions = {
  "alpine-lake": "A loop around a glacial lake, under the peaks.",
  "cedar-falls": "A short walk through old cedars to a waterfall.",
  "ridge-line": "A long, exposed traverse for strong legs.",
  "pine-hollow": "A gentle forest path, shaded in summer.",
  "granite-peak": "A steep climb to a bare summit and a wide view.",
  "salt-marsh": "A flat boardwalk through the marsh, full of birds.",
};

// A trail that nobody has reviewed yet
export const extraTrails = [
  {
    slug: "fern-gully",
    name: "Fern Gully",
    region: "forest",
    level: "Easy",
    km: 2.8,
    description: "A short, damp path between giant ferns.",
  },
];

// Invented people: example.com is reserved
export const people = [
  { key: "maya", name: "Maya Chen", email: "maya@example.com" },
  { key: "tom", name: "Tom Rivera", email: "tom@example.com" },
  { key: "ines", name: "Ines Costa", email: "ines@example.com" },
  { key: "ravi", name: "Ravi Patel", email: "ravi@example.com" },
  { key: "lena", name: "Lena Fischer", email: "lena@example.com" },
];

// trail slug, author key, rating, text, date
export const reviewRows = [
  ["alpine-lake", "maya", 5, "Clear water, easy to follow.", "2026-03-14"],
  ["alpine-lake", "tom", 4, "Busy at the weekend, go early.", "2026-03-29"],
  ["alpine-lake", "lena", 5, "The light on the lake at sunrise.", "2026-04-11"],
  ["cedar-falls", "ines", 5, "The falls are worth it.", "2026-03-20"],
  ["cedar-falls", "ravi", 4, "Slippery steps near the top.", "2026-05-02"],
  ["ridge-line", "ravi", 4, "Long, steep and beautiful.", "2026-04-18"],
  ["ridge-line", "maya", 3, "Too exposed in the wind.", "2026-05-09"],
  ["pine-hollow", "lena", 3, "Muddy after the rain.", "2026-04-05"],
  ["pine-hollow", "tom", 4, "Quiet, and good for kids.", "2026-06-01"],
  ["granite-peak", "ravi", 5, "Worth every step of the climb.", "2026-06-14"],
  ["salt-marsh", "ines", 4, "Bring binoculars for the birds.", "2026-05-21"],
  ["salt-marsh", "maya", 5, "Flat, easy, and full of herons.", "2026-06-20"],
];
