import { count, eq } from "drizzle-orm";
import { db } from "./db.mjs";
import { reviews, trails } from "../src/db/schema.js";

// A copy of the alpine lake, with one review
function setup() {
  db.delete(trails).where(eq(trails.slug, "alpine-lake-copy")).run();
  const copy = db
    .insert(trails)
    .values({
      slug: "alpine-lake-copy",
      name: "Alpine Lake (copy)",
      region: "alps",
      level: "Moderate",
      km: 8.4,
    })
    .returning()
    .get();
  db.insert(reviews)
    .values({ trailId: copy.id, rating: 4, text: "Posted on the copy." })
    .run();
  return copy;
}

const original = db.select().from(trails).where(eq(trails.slug, "alpine-lake")).get();

// Move the reviews, then remove the copy
function merge(tx, from, failBetween) {
  tx.update(reviews)
    .set({ trailId: original.id })
    .where(eq(reviews.trailId, from.id))
    .run();
  if (failBetween) throw new Error("the server stopped");
  tx.delete(trails).where(eq(trails.id, from.id)).run();
}

function report(label, copy) {
  const still = db.select().from(trails).where(eq(trails.id, copy.id)).get();
  const left = db
    .select({ n: count() })
    .from(reviews)
    .where(eq(reviews.trailId, copy.id))
    .get().n;
  console.log(`${label}: copy exists ${Boolean(still)}, reviews on the copy: ${left}`);
}

const experiment = process.argv[2];

if (experiment === "plain") {
  const copy = setup();
  try {
    merge(db, copy, true);
  } catch (error) {
    console.log("error:", error.message);
  }
  report("without a transaction", copy);
}

if (experiment === "transaction") {
  const copy = setup();
  try {
    db.transaction((tx) => merge(tx, copy, true), { behavior: "immediate" });
  } catch (error) {
    console.log("error:", error.message);
  }
  report("with a transaction", copy);
}

if (experiment === "success") {
  const copy = setup();
  db.transaction((tx) => merge(tx, copy, false), { behavior: "immediate" });
  report("after a good merge", copy);
  const total = db
    .select({ n: count() })
    .from(reviews)
    .where(eq(reviews.trailId, original.id))
    .get().n;
  console.log("alpine lake reviews:", total);
}
