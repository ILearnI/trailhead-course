import Database from "better-sqlite3";
import { count, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { reviews, trails, users } from "../src/db/schema.js";
import { trails as trailRows } from "../src/data/trails.js";
import { descriptions, extraTrails, people, reviewRows } from "../src/db/seed-data.js";

const sqlite = new Database("data/trailhead.db");
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");
const db = drizzle(sqlite);

// All the steps, or none
db.transaction((tx) => {
  // Empty the tables, the children first
  tx.delete(reviews).run();
  tx.delete(trails).run();
  tx.delete(users).run();
  // Start the ids again at 1
  tx.run(sql`delete from sqlite_sequence where name in ('trails', 'users', 'reviews')`);

  // The trails of the site, and the extra one
  const allTrails = [
    ...trailRows.map((t) => ({ ...t, description: descriptions[t.slug] })),
    ...extraTrails,
  ];

  const savedTrails = tx
    .insert(trails)
    .values(
      allTrails.map((t) => ({
        slug: t.slug,
        name: t.name,
        region: t.region,
        level: t.level,
        km: t.km,
        description: t.description,
      })),
    )
    .returning()
    .all();
  const savedUsers = tx
    .insert(users)
    .values(people.map((p) => ({ name: p.name, email: p.email })))
    .returning()
    .all();

  // From slug and key to the ids that were made
  const trailId = Object.fromEntries(savedTrails.map((t) => [t.slug, t.id]));
  const userId = Object.fromEntries(
    people.map((p) => [p.key, savedUsers.find((u) => u.email === p.email).id]),
  );

  tx.insert(reviews)
    .values(
      reviewRows.map(([trail, user, rating, text, date]) => ({
        trailId: trailId[trail],
        userId: userId[user],
        rating,
        text,
        createdAt: new Date(date),
      })),
    )
    .run();
});

// How many rows are in a table
const total = (table) => db.select({ value: count() }).from(table).get().value;
console.log(
  `trails: ${total(trails)}, users: ${total(users)}, reviews: ${total(reviews)}`,
);
