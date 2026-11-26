import { eq } from "drizzle-orm";
import { db } from "./db.mjs";
import { users } from "../src/db/schema.js";

// The email, and the role
const [email, role] = process.argv.slice(2);
db.update(users).set({ role }).where(eq(users.email, email)).run();
console.log(`${email} is now ${role}`);
