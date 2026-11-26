// @vitest-environment node
import { beforeEach, describe, expect, it } from "vitest";
import { count, eq, isNull } from "drizzle-orm";
import { reviews, trails, users } from "@/db/schema";
import { createTestDb } from "@/test/db";
import { seedTestDb } from "@/test/seed";

let db;
let ids;

// A seeded database before every test
beforeEach(() => {
  db = createTestDb().db;
  ids = seedTestDb(db);
});

// How many rows are in a table
const total = (table) => db.select({ value: count() }).from(table).get().value;

describe("unique and required columns", () => {
  it("refuses a second trail with the same slug", () => {
    const copy = {
      slug: "cedar-falls",
      name: "Copy",
      region: "coast",
      level: "Easy",
      km: 1,
    };
    const insert = () => db.insert(trails).values(copy).run();
    expect(insert).toThrow("UNIQUE constraint failed: trails.slug");
  });

  it("refuses a second user with the same email", () => {
    const person = { name: "Test", email: "maya@example.com" };
    const insert = () => db.insert(users).values(person).run();
    expect(insert).toThrow("UNIQUE constraint failed: users.email");
  });

  it("refuses a trail without a name", () => {
    const bad = {
      slug: "no-name",
      name: null,
      region: "alps",
      level: "Easy",
      km: 1,
    };
    const insert = () => db.insert(trails).values(bad).run();
    expect(insert).toThrow("NOT NULL constraint failed: trails.name");
  });
});

describe("the rules of the links", () => {
  it("deletes the reviews of a deleted trail", () => {
    db.delete(trails).where(eq(trails.slug, "alpine-lake")).run();
    expect(total(reviews)).toBe(9);
  });

  it("keeps the reviews of a deleted user, as anonymous", () => {
    db.delete(users).where(eq(users.id, ids.userId.maya)).run();
    expect(total(reviews)).toBe(12);
    const anonymous = db.select().from(reviews).where(isNull(reviews.userId)).all();
    expect(anonymous).toHaveLength(3);
  });
});
