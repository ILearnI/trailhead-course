import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "../src/db/schema.js";

// The same settings as the app client
const sqlite = new Database("data/trailhead.db");
sqlite.pragma("foreign_keys = ON");
// Count the queries that Drizzle sends
let queries = 0;
const logger = { logQuery: () => (queries += 1) };

export const db = drizzle(sqlite, { schema, logger });
export const queryCount = () => queries;
