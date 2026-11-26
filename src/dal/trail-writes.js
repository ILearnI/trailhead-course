import "server-only";
import { eq } from "drizzle-orm";
import { requirePermission } from "@/dal/auth";
import { db } from "@/db";
import { trails } from "@/db/schema";
import { slugify } from "@/lib/slugify";

// An empty description is stored as null
function toRow(data) {
  return { ...data, description: data.description || null };
}

export async function createTrail(data) {
  await requirePermission("trail:write");
  const slug = slugify(data.name);
  const found = db.select({ id: trails.id }).from(trails).where(eq(trails.slug, slug)).get();
  if (found) return { ok: false, error: "A trail with this name exists" };
  db.insert(trails).values({ slug, ...toRow(data) }).run();
  return { ok: true, slug };
}

export async function updateTrail(slug, data) {
  await requirePermission("trail:write");
  const where = eq(trails.slug, slug);
  const old = db.select({ photo: trails.photo }).from(trails).where(where).get();
  if (!old) return { ok: false, error: "No such trail" };
  db.update(trails).set(toRow(data)).where(where).run();
  // The photo that this update replaced, to remove
  const replaced = data.photo && old.photo !== data.photo ? old.photo : null;
  return { ok: true, slug, replaced };
}

export async function deleteTrail(slug) {
  await requirePermission("trail:write");
  const where = eq(trails.slug, slug);
  const row = db.select({ photo: trails.photo }).from(trails).where(where).get();
  const result = db.delete(trails).where(where).run();
  return { ok: result.changes > 0, photo: row?.photo ?? null };
}

// For the edit form: fresh, never cached
export async function getEditableTrail(slug) {
  await requirePermission("trail:write");
  return db.select().from(trails).where(eq(trails.slug, slug)).get() ?? null;
}
