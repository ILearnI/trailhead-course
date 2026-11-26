import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { and, asc, avg, count, desc, eq, gte, sql } from "drizzle-orm";
import { db } from "@/db";
import { reviews, trails } from "@/db/schema";
import { tags } from "@/lib/tags";

// The trails for a list, by name
export async function listTrails() {
  "use cache";
  cacheLife("catalog");
  cacheTag(tags.trails);

  return db
    .select({
      slug: trails.slug,
      name: trails.name,
      region: trails.region,
      level: trails.level,
      km: trails.km,
    })
    .from(trails)
    .orderBy(asc(trails.name))
    .all();
}

// One trail by its slug, or null
export async function getTrail(slug) {
  "use cache";
  cacheLife("catalog");
  cacheTag(tags.trail(slug));

  const row = db.select().from(trails).where(eq(trails.slug, slug)).get();
  return row ?? null;
}

// The best trails, by average rating
export async function topTrails(limit = 5) {
  "use cache";
  cacheLife("community");
  cacheTag(tags.ranking);

  const rows = db
    .select({
      slug: trails.slug,
      name: trails.name,
      reviews: count(reviews.id),
      average: avg(reviews.rating),
    })
    .from(trails)
    .innerJoin(reviews, eq(reviews.trailId, trails.id))
    .groupBy(trails.id)
    .having(gte(count(reviews.id), 2))
    .orderBy(desc(avg(reviews.rating)), desc(count(reviews.id)), asc(trails.name))
    .limit(limit)
    .all();
  return rows.map((row) => ({ ...row, average: Number(row.average) }));
}

const PAGE_SIZE = 3;

// Make a text safe to use inside a LIKE pattern
function escapeLike(text) {
  return text.replace(/[!%_]/g, "!$&");
}

// Search, filter and page the trails
export async function searchTrails({ q = "", level, page = 1 } = {}) {
  "use cache";
  cacheLife("catalog");
  cacheTag(tags.trails);

  const conditions = [];
  if (q) conditions.push(sql`${trails.name} LIKE ${`%${escapeLike(q)}%`} ESCAPE '!'`);
  if (level) conditions.push(eq(trails.level, level));
  const where = and(...conditions);
  const total = db.select({ value: count() }).from(trails).where(where).get().value;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const current = Math.min(Math.max(Math.floor(page), 1), pages);
  const items = db
    .select({ slug: trails.slug, name: trails.name, level: trails.level, km: trails.km })
    .from(trails)
    .where(where)
    .orderBy(asc(trails.name))
    .limit(PAGE_SIZE)
    .offset((current - 1) * PAGE_SIZE)
    .all();
  return { items, total, pages, page: current };
}

// Move the reviews, then delete the copy
export async function mergeTrails(fromSlug, intoSlug) {
  return db.transaction(
    (tx) => {
      const find = (slug) =>
        tx.select({ id: trails.id }).from(trails).where(eq(trails.slug, slug)).get();
      const from = find(fromSlug);
      const into = find(intoSlug);
      if (!from || !into) throw new Error("Unknown trail");
      const moved = tx
        .update(reviews)
        .set({ trailId: into.id })
        .where(eq(reviews.trailId, from.id))
        .returning({ id: reviews.id })
        .all();
      tx.delete(trails).where(eq(trails.id, from.id)).run();
      return { moved: moved.length };
    },
    { behavior: "immediate" },
  );
}
