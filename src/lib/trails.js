import { trails } from "@/data/trails";

export function getTrail(slug) {
  return trails.find((trail) => trail.slug === slug);
}

export function trailParams() {
  return trails.map((trail) => ({ slug: trail.slug }));
}
