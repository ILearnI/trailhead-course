import { db } from "./db.mjs";
import { users } from "../src/db/schema.js";

// Each user, and whether a password hash is stored
for (const user of db.select().from(users).all()) {
  const stored = user.passwordHash
    ? `a hash of ${user.passwordHash.length} characters`
    : "no password";
  console.log(`${user.email}: ${user.role}, ${stored}`);
}
