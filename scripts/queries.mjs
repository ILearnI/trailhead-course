import { and, asc, avg, between, count, desc, eq, inArray, like, or } from "drizzle-orm";
import { db } from "./db.mjs";
import { trails } from "../src/db/schema.js";

// Print a label, and the names of the rows
const show = (label, rows) =>
  console.log(`${label}: ${rows.map((row) => row.name).join(", ")}`);

show("all", db.select().from(trails).all());
show("hard", db.select().from(trails).where(eq(trails.level, "Hard")).all());

console.log(db.select().from(trails).where(eq(trails.level, "Hard")).toSQL());

// Combine conditions
const where = (condition) => db.select().from(trails).where(condition).all();
show("alps and hard", where(and(eq(trails.region, "alps"), eq(trails.level, "Hard"))));
show("easy or coast", where(or(eq(trails.level, "Easy"), eq(trails.region, "coast"))));
show("5 to 10 km", where(between(trails.km, 5, 10)));
show("name has Falls", where(like(trails.name, "%Falls%")));
show("alps or forest", where(inArray(trails.region, ["alps", "forest"])));

// Order, and slice
const ordered = (...columns) => db.select().from(trails).orderBy(...columns).all();
show("longest first", ordered(desc(trails.km)));
show("level, then name", ordered(asc(trails.level), asc(trails.name)));
const byKm = db.select().from(trails).orderBy(asc(trails.km));
show("two shortest", byKm.limit(2).all());
show("next two", db.select().from(trails).orderBy(asc(trails.km)).limit(2).offset(2).all());

// Aggregates: one row for each group
const stats = db
  .select({ region: trails.region, total: count(), average: avg(trails.km) })
  .from(trails)
  .groupBy(trails.region)
  .all();
for (const row of stats) {
  const km = Number(row.average).toFixed(1);
  console.log(`${row.region}: ${row.total} trail(s), ${km} km on average`);
}
