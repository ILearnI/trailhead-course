import { asc, avg, count, desc, eq } from "drizzle-orm";
import { db, queryCount } from "./db.mjs";
import { reviews, trails, users } from "../src/db/schema.js";

const experiment = process.argv[2];

if (experiment === "naive") {
  const all = db.select().from(trails).all();
  for (const trail of all) {
    trail.reviews = db.select().from(reviews).where(eq(reviews.trailId, trail.id)).all();
  }
  console.log(`${all.length} trails, queries: ${queryCount()}`);
}

if (experiment === "join") {
  const rows = db
    .select({ trail: trails.name, rating: reviews.rating, author: users.name })
    .from(reviews)
    .innerJoin(trails, eq(reviews.trailId, trails.id))
    .leftJoin(users, eq(reviews.userId, users.id))
    .orderBy(asc(trails.name), desc(reviews.rating))
    .all();
  console.log(`${rows.length} rows, queries: ${queryCount()}`);
  console.log(rows.slice(0, 3));
}

if (experiment === "stats") {
  const rows = db
    .select({ name: trails.name, reviews: count(reviews.id), average: avg(reviews.rating) })
    .from(trails)
    .leftJoin(reviews, eq(reviews.trailId, trails.id))
    .groupBy(trails.id)
    .orderBy(desc(avg(reviews.rating)))
    .all();
  for (const row of rows) {
    const rating = row.average ? Number(row.average).toFixed(1) : "none";
    console.log(`${row.name}: ${row.reviews} review(s), average ${rating}`);
  }
}

if (experiment === "with") {
  const rows = db.query.trails
    .findMany({
      orderBy: asc(trails.name),
      with: {
        reviews: {
          orderBy: desc(reviews.createdAt),
          limit: 2,
          with: { user: { columns: { name: true } } },
        },
      },
    })
    .sync();
  console.log(`${rows.length} trails, queries: ${queryCount()}`);
  for (const trail of rows) {
    const latest = trail.reviews[0];
    console.log(`${trail.name}: latest by ${latest?.user?.name ?? "nobody"}`);
  }
}
