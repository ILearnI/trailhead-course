// The shape of a value: only the types
export function shapeOf(value) {
  if (Array.isArray(value)) return value.length ? [shapeOf(value[0])] : [];
  if (value === null) return "null";
  if (typeof value !== "object") return typeof value;
  const entries = Object.entries(value).sort(([a], [b]) => a.localeCompare(b));
  return Object.fromEntries(entries.map(([key, item]) => [key, shapeOf(item)]));
}
