// The trails that match the filters
// An empty filter matches all
export function filterTrails(trails, { region, level, maxKm }) {
  return trails.filter(
    (trail) =>
      (!region || trail.region === region) &&
      (!level || trail.level === level) &&
      (!maxKm || trail.km <= maxKm),
  );
}
