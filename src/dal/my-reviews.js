import "server-only";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { reviews, trails } from "@/db/schema";
import { verifySession } from "@/dal/auth";

// The reviews of the signed in user, nobody else
export async function listMyReviews() {
  const { userId } = await verifySession();
  return db
    .select({
      id: reviews.id,
      trail: trails.name,
      rating: reviews.rating,
      text: reviews.text,
    })
    .from(reviews)
    .innerJoin(trails, eq(reviews.trailId, trails.id))
    .where(eq(reviews.userId, userId))
    .orderBy(desc(reviews.createdAt))
    .all();
}

// Delete one of my reviews: the owner is checked
export async function deleteMyReview(id) {
  const { userId } = await verifySession();
  const mine = and(eq(reviews.id, id), eq(reviews.userId, userId));
  const found = db
    .select({ slug: trails.slug })
    .from(reviews)
    .innerJoin(trails, eq(reviews.trailId, trails.id))
    .where(mine)
    .get();
  if (!found) return null;
  db.delete(reviews).where(mine).run();
  return found.slug;
}
