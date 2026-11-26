import { reviews, trails, users } from "@/db/schema";
import { trails as trailRows } from "@/data/trails";
import { descriptions, extraTrails, people, reviewRows } from "@/db/seed-data";

// The same data as the seed script, for a test database
export function seedTestDb(db) {
  const rows = [
    ...trailRows.map((t) => ({ ...t, description: descriptions[t.slug] })),
    ...extraTrails,
  ];
  const savedTrails = db
    .insert(trails)
    .values(
      rows.map((t) => ({
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
  const savedUsers = db
    .insert(users)
    .values(people.map((p) => ({ name: p.name, email: p.email })))
    .returning()
    .all();
  const trailId = Object.fromEntries(savedTrails.map((t) => [t.slug, t.id]));
  const userId = Object.fromEntries(
    people.map((p) => [p.key, savedUsers.find((u) => u.email === p.email).id]),
  );
  db.insert(reviews)
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
  return { trailId, userId };
}
