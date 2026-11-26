import { count, eq, inArray, sql } from "drizzle-orm";
import { db } from "./db.mjs";
import { trails } from "../src/db/schema.js";

// The trails that this script creates
const NEW = ["lake-view", "moss-trail", "bluff-walk"];
db.delete(trails).where(inArray(trails.slug, NEW)).run();

// 1. Insert one row, and read it back
const lakeRow = {
  slug: "lake-view",
  name: "Lake View",
  region: "alps",
  level: "Easy",
  km: 3.2,
};
const lake = db.insert(trails).values(lakeRow).returning().get();
console.log("inserted:", lake.name, `(id ${lake.id})`);

// 2. Several rows in one statement
const more = db
  .insert(trails)
  .values([
    { slug: "moss-trail", name: "Moss Trail", region: "forest", level: "Easy", km: 2.1 },
    { slug: "bluff-walk", name: "Bluff Walk", region: "coast", level: "Moderate", km: 5.6 },
  ])
  .returning()
  .all();
console.log("inserted:", more.map((t) => t.name).join(", "));

// 3. The same slug again
try {
  db.insert(trails).values(lakeRow).run();
} catch (error) {
  console.log("refused:", error.message);
}
const ignored = db.insert(trails).values(lakeRow).onConflictDoNothing().run();
console.log("ignored, changes:", ignored.changes);

const upserted = db
  .insert(trails)
  .values(lakeRow)
  .onConflictDoUpdate({ target: trails.slug, set: { km: 3.4 } })
  .returning()
  .get();
console.log("upserted km:", upserted.km);

// 4. Update
const changed = db
  .update(trails)
  .set({ level: "Moderate" })
  .where(eq(trails.slug, "lake-view"))
  .returning()
  .get();
console.log("updated:", changed.name, changed.level);

db.update(trails)
  .set({ km: sql`${trails.km} + 0.5` })
  .where(eq(trails.slug, "lake-view"))
  .run();
const row = db.select().from(trails).where(eq(trails.slug, "lake-view")).get();
console.log("km after + 0.5:", row.km);

// 5. Delete
const removed = db.delete(trails).where(inArray(trails.slug, NEW)).returning().all();
console.log("deleted:", removed.map((t) => t.name).join(", "));
const left = db.select({ value: count() }).from(trails).get().value;
console.log("trails left:", left);

// 6. Without where, an update touches every row
console.log(db.update(trails).set({ level: "Hard" }).toSQL().sql);
