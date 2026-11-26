import "server-only";
import { count } from "drizzle-orm";
import { db } from "@/db";
import { reviews } from "@/db/schema";

// How many reviews exist now: never cached
export async function countReviews() {
  return db.select({ value: count() }).from(reviews).get().value;
}
