import { eq } from "drizzle-orm";
import { db } from "./db.mjs";
import { users } from "../src/db/schema.js";
import { hashPassword } from "../src/lib/password.js";

// The email, and the new password
const [email, password] = process.argv.slice(2);
const passwordHash = await hashPassword(password);
db.update(users).set({ passwordHash }).where(eq(users.email, email)).run();
console.log(`password set for ${email}`);
