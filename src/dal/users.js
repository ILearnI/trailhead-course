import "server-only";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";

// A user by email, without the password hash
export async function findUserByEmail(email) {
  const row = db
    .select({ id: users.id, name: users.name, email: users.email })
    .from(users)
    .where(eq(users.email, email))
    .get();
  return row ?? null;
}

// Only for the login: this one returns the hash
export async function findUserForLogin(email) {
  const row = db
    .select({ id: users.id, passwordHash: users.passwordHash })
    .from(users)
    .where(eq(users.email, email))
    .get();
  return row ?? null;
}

// Create a user: the caller hashed the password
export async function createUser({ name, email, passwordHash }) {
  return db
    .insert(users)
    .values({ name, email, passwordHash })
    .returning({ id: users.id })
    .get();
}

// A user by id, for the pages: no hash
export async function findUserById(id) {
  const row = db
    .select({ id: users.id, name: users.name, email: users.email, role: users.role })
    .from(users)
    .where(eq(users.id, id))
    .get();
  return row ?? null;
}
