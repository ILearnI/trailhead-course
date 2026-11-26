import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { avg, count, desc, gte, sql } from "drizzle-orm";
import { db } from "@/db";
import { reviews, trails } from "@/db/schema";
import { count as track } from "@/lib/calls";
import { tags } from "@/lib/tags";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const stamp = () => new Date().toISOString().slice(11, 19);

// Reviews, trails and the average rating
export async function getTotals() {
  "use cache";
  cacheLife("community");
  cacheTag(tags.ranking);
  track("analytics:totals");
  await sleep(800);
  const row = db
    .select({ reviews: count(), average: avg(reviews.rating) })
    .from(reviews)
    .get();
  const trailCount = db.select({ value: count() }).from(trails).get().value;
  return { ...row, trailCount, average: Number(row.average).toFixed(1), at: stamp() };
}

// Reviews and average rating, by region
export async function getByRegion() {
  "use cache";
  cacheLife("community");
  cacheTag(tags.ranking, tags.trails);
  track("analytics:regions");
  await sleep(700);
  const rows = db
    .select({
      region: trails.region,
      reviews: count(reviews.id),
      average: avg(reviews.rating),
    })
    .from(trails)
    .leftJoin(reviews, sql`${reviews.trailId} = ${trails.id}`)
    .groupBy(trails.region)
    .all();
  return { rows, at: stamp() };
}

// The newest trails
export async function getNewest() {
  "use cache";
  cacheLife("catalog");
  cacheTag(tags.trails);
  track("analytics:newest");
  await sleep(600);
  const rows = db
    .select({ name: trails.name })
    .from(trails)
    .orderBy(desc(trails.createdAt), desc(trails.id))
    .limit(3)
    .all();
  return { rows, at: stamp() };
}

// Reviews of the last five minutes: never cached
export async function getRecent() {
  const since = new Date(Date.now() - 5 * 60 * 1000);
  const row = db
    .select({ value: count() })
    .from(reviews)
    .where(gte(reviews.createdAt, since))
    .get();
  return row.value;
}
