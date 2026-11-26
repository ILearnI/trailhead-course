import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { reviews, trails, users } from "@/db/schema";
import { tags } from "@/lib/tags";

// The reviews of a trail, the newest first
export async function listReviews(slug) {
  "use cache";
  cacheLife("community");
  cacheTag(tags.reviews(slug));

  const rows = db
    .select({
      id: reviews.id,
      author: users.name,
      rating: reviews.rating,
      text: reviews.text,
    })
    .from(reviews)
    .innerJoin(trails, eq(reviews.trailId, trails.id))
    .leftJoin(users, eq(reviews.userId, users.id))
    .where(eq(trails.slug, slug))
    .orderBy(desc(reviews.createdAt))
    .all();
  return rows.map((row) => ({ ...row, author: row.author ?? "Anonymous" }));
}

// Add an anonymous review to a trail
export async function createReview({ slug, rating, text, userId }) {
  const trail = db
    .select({ id: trails.id })
    .from(trails)
    .where(eq(trails.slug, slug))
    .get();
  if (!trail) return null;
  return db
    .insert(reviews)
    .values({ trailId: trail.id, rating, text, userId })
    .returning({ id: reviews.id })
    .get();
}
