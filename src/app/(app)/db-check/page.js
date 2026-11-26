import { asc, sql } from "drizzle-orm";
import { db } from "@/db";
import { trails } from "@/db/schema";

export default function DbCheckPage() {
  const row = db.get(sql`select sqlite_version() as version`);
  const rows = db.query.trails
    .findMany({
      orderBy: asc(trails.name),
      with: { reviews: { columns: { id: true } } },
    })
    .sync();

  return (
    <main className="mx-auto max-w-3xl p-4 md:p-8">
      <h1 className="text-3xl font-semibold">Database check</h1>
      <p className="mt-4">{`SQLite ${row.version}, through Drizzle.`}</p>
      <h2 className="mt-6 font-semibold">Trails and reviews</h2>
      <ul className="mt-2 list-disc pl-6">
        {rows.map((trail) => (
          <li key={trail.id}>{`${trail.name}: ${trail.reviews.length} review(s)`}</li>
        ))}
      </ul>
    </main>
  );
}
