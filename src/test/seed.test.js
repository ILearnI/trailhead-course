// @vitest-environment node
import { describe, it, expect } from "vitest";
import { count } from "drizzle-orm";
import { reviews, trails, users } from "@/db/schema";
import { createTestDb } from "./db";
import { seedTestDb } from "./seed";

const total = (db, table) => db.select({ value: count() }).from(table).get().value;

describe("seedTestDb", () => {
  it("fills the tables like the real seed", () => {
    const { db } = createTestDb();
    seedTestDb(db);
    expect([total(db, trails), total(db, users), total(db, reviews)]).toEqual([7, 5, 12]);
  });

  it("returns the ids by slug", () => {
    const { db } = createTestDb();
    const { trailId } = seedTestDb(db);
    expect(Object.keys(trailId)).toContain("alpine-lake");
  });
});
