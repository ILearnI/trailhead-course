import { trails } from "@/db/schema";

// Insert a valid trail: tests override what matters
export function createTrail(db, overrides = {}) {
  const random = Math.random().toString(36).slice(2, 8);
  return db
    .insert(trails)
    .values({
      slug: `trail-${random}`,
      name: "A Trail",
      region: "alps",
      level: "Easy",
      km: 5,
      ...overrides,
    })
    .returning()
    .get();
}
