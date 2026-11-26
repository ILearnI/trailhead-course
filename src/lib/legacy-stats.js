import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { connection } from "next/server";
import { count } from "drizzle-orm";
import { db } from "@/db";
import { reviews } from "@/db/schema";
import { tags } from "@/lib/tags";

// Cached: a profile, and the tag of the aggregates
export async function getReviewCount() {
  "use cache";
  cacheLife("community");
  cacheTag(tags.ranking);
  return db.select({ value: count() }).from(reviews).get().value;
}

// Never cached: it waits for a request
export async function getClock() {
  await connection();
  return new Date().toISOString().slice(11, 19);
}
