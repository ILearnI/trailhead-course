import "server-only";
import { mkdirSync } from "node:fs";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

// The database lives in the data folder
mkdirSync("data", { recursive: true });

// Reuse the connection when modules reload
const sqlite = globalThis.sqlite ?? new Database("data/trailhead.db");
if (process.env.NODE_ENV !== "production") globalThis.sqlite = sqlite;

// Readers do not wait for the writer
sqlite.pragma("journal_mode = WAL");
// Check the links between tables
sqlite.pragma("foreign_keys = ON");
// Wait for another writer, up to 5 seconds
sqlite.pragma("busy_timeout = 5000");

export const db = drizzle(sqlite, { schema });
