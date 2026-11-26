export function slugify(text) {
  return text
    .toLowerCase()
    // Any run of other characters: one dash
    .replace(/[^a-z0-9]+/g, "-")
    // No dash at the start or at the end
    .replace(/^-+|-+$/g, "");
}

export function formatKm(km) {
  // A distance cannot be negative
  if (km < 0) throw new Error("Distance cannot be negative");
  // Under one kilometer, show meters
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km} km`;
}
