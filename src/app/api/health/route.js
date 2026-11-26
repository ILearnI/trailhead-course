import { sql } from "drizzle-orm";
import { connection } from "next/server";
import { db } from "@/db";
import { pingCache } from "@/lib/redis-ping";

// Required: without it we cannot serve
function databaseUp() {
  try {
    db.get(sql`select 1`);
    return true;
  } catch {
    return false;
  }
}

// For monitors and containers: can we serve?
export async function GET() {
  // Checked at each call, never at build time
  await connection();
  const database = databaseUp();
  // Optional: pages work without the cache
  const cache = await pingCache();
  const status = !database ? "down" : cache ? "ok" : "degraded";
  return Response.json(
    { status, database: database ? "ok" : "down", cache: cache ? "ok" : "down" },
    { status: database ? 200 : 503 },
  );
}
