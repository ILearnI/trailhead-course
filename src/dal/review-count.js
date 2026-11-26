import "server-only";
import { count, eq } from "drizzle-orm";
import { db } from "@/db";
import { reviews, trails } from "@/db/schema";

// How many reviews exist now: never cached
export async function countReviews() {
  return db.select({ value: count() }).from(reviews).get().value;
}

// How many reviews one trail has now: never cached
export async function countReviewsFor(slug) {
  return db
    .select({ value: count() })
    .from(reviews)
    .innerJoin(trails, eq(reviews.trailId, trails.id))
    .where(eq(trails.slug, slug))
    .get().value;
}
