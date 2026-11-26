import { createClient } from "@libsql/client";
import { count } from "drizzle-orm";
import { drizzle } from "drizzle-orm/libsql";
import { trails } from "../src/db/schema.js";

// The same file, through the libSQL client
const client = createClient({ url: "file:data/trailhead.db" });
const db = drizzle(client);

// Every call is a promise: await it
const total = await db.select({ value: count() }).from(trails);
console.log("trails:", total[0].value);
const first = await db.select().from(trails).limit(1);
console.log("first:", first[0].name);
