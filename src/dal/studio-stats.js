import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { asc, avg, count, desc, eq, gte, isNull } from "drizzle-orm";
import { requirePermission } from "@/dal/auth";
import { db } from "@/db";
import { reviews, trails } from "@/db/schema";
import { tags } from "@/lib/tags";

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

// The numbers, kept for a minute
async function loadStats() {
  "use cache";
  cacheLife("community");
  cacheTag(tags.trails, tags.ranking);
  const totals = db
    .select({ reviews: count(), average: avg(reviews.rating) })
    .from(reviews)
    .get();
  const trailCount = db.select({ value: count() }).from(trails).get().value;
  const since = new Date(Date.now() - WEEK_MS);
  const lastWeek = db
    .select({ value: count() })
    .from(reviews)
    .where(gte(reviews.createdAt, since))
    .get().value;
  const unreviewed = db
    .select({ value: count() })
    .from(trails)
    .leftJoin(reviews, eq(reviews.trailId, trails.id))
    .where(isNull(reviews.id))
    .get().value;
  const top = db
    .select({
      slug: trails.slug,
      name: trails.name,
      reviews: count(reviews.id),
      average: avg(reviews.rating),
    })
    .from(trails)
    .leftJoin(reviews, eq(reviews.trailId, trails.id))
    .groupBy(trails.id)
    .orderBy(desc(count(reviews.id)), asc(trails.name))
    .limit(5)
    .all();
  const number = (value) => (value === null ? null : Number(value));
  return {
    trails: trailCount,
    reviews: totals.reviews,
    average: number(totals.average),
    lastWeek,
    unreviewed,
    top: top.map((row) => ({ ...row, average: number(row.average) })),
    at: new Date().toISOString().slice(11, 19),
  };
}

// The permission is checked outside of the cache
export async function getStudioStats() {
  await requirePermission("studio:view");
  return loadStats();
}
