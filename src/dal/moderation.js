import "server-only";
import { desc, eq } from "drizzle-orm";
import { requirePermission } from "@/dal/auth";
import { db } from "@/db";
import { reviews, trails, users } from "@/db/schema";

// The newest reviews, for a moderator
export async function listRecentReviews(limit = 20) {
  await requirePermission("review:delete:any");
  return db
    .select({
      id: reviews.id,
      rating: reviews.rating,
      text: reviews.text,
      trail: trails.name,
      author: users.name,
    })
    .from(reviews)
    .innerJoin(trails, eq(reviews.trailId, trails.id))
    .leftJoin(users, eq(reviews.userId, users.id))
    .orderBy(desc(reviews.createdAt), desc(reviews.id))
    .limit(limit)
    .all();
}

// Remove a review, and say which trail it was on
export async function deleteReview(id) {
  await requirePermission("review:delete:any");
  const row = db
    .select({ slug: trails.slug })
    .from(reviews)
    .innerJoin(trails, eq(reviews.trailId, trails.id))
    .where(eq(reviews.id, id))
    .get();
  if (!row) return { ok: false };
  db.delete(reviews).where(eq(reviews.id, id)).run();
  return { ok: true, slug: row.slug };
}
