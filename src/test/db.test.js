// @vitest-environment node
import { describe, it, expect } from "vitest";
import { reviews, trails } from "@/db/schema";
import { createTestDb } from "./db";

// A valid trail, that the tests can insert
const trailRow = {
  slug: "test-trail",
  name: "Test Trail",
  region: "alps",
  level: "Easy",
  km: 1,
};

describe("createTestDb", () => {
  it("applies the real migrations", () => {
    const { sqlite } = createTestDb();
    const rows = sqlite
      .prepare("SELECT name FROM sqlite_master WHERE type = 'table'")
      .all();
    expect(rows.map((row) => row.name)).toContain("reviews");
  });

  it("turns the foreign keys on", () => {
    const { db } = createTestDb();
    const bad = { trailId: 999, rating: 5, text: "Nobody home" };
    const insert = () => db.insert(reviews).values(bad).run();
    expect(insert).toThrow("FOREIGN KEY");
  });

  it("fills the default columns", () => {
    const { db } = createTestDb();
    const row = db.insert(trails).values(trailRow).returning().get();
    expect(row.id).toBe(1);
    expect(row.createdAt).toBeInstanceOf(Date);
  });

  it("gives every test its own database", () => {
    const first = createTestDb();
    first.db.insert(trails).values(trailRow).run();
    const second = createTestDb();
    expect(second.db.select().from(trails).all()).toHaveLength(0);
  });
});
