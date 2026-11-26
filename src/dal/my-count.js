import "server-only";
import { cacheLife } from "next/cache";
import { count, eq } from "drizzle-orm";
import { db } from "@/db";
import { reviews } from "@/db/schema";
import { getSession } from "@/lib/session";

// The number of reviews of the signed in user
export async function getMyReviewCount() {
  "use cache: private";
  cacheLife("minutes");
  const session = await getSession();
  if (!session) return 0;
  return db
    .select({ value: count() })
    .from(reviews)
    .where(eq(reviews.userId, session.userId))
    .get().value;
}
