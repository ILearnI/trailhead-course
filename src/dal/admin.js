import "server-only";
import { asc, count, eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { requirePermission } from "@/dal/auth";

// All the users, for an admin
export async function listUsers() {
  await requirePermission("user:read");
  return db
    .select({ id: users.id, name: users.name, email: users.email, role: users.role })
    .from(users)
    .orderBy(asc(users.id))
    .all();
}

// Change a role, but never remove the last admin
export async function setRole(id, role) {
  await requirePermission("user:set-role");
  const target = db.select().from(users).where(eq(users.id, id)).get();
  if (!target) return { ok: false, error: "No such user" };
  const admins = db
    .select({ value: count() })
    .from(users)
    .where(eq(users.role, "admin"))
    .get().value;
  if (target.role === "admin" && role !== "admin" && admins === 1) {
    return { ok: false, error: "Keep at least one admin" };
  }
  db.update(users).set({ role }).where(eq(users.id, id)).run();
  return { ok: true };
}
