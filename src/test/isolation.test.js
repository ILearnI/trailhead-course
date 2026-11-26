// @vitest-environment node
import { beforeEach, describe, it, expect } from "vitest";
import { trails } from "@/db/schema";
import { createTestDb } from "./db";
import { createTrail } from "./factories";

// A new database before every test
let db;
beforeEach(() => {
  db = createTestDb().db;
});

describe("shared state", () => {
  it("starts empty", () => {
    expect(db.select().from(trails).all()).toHaveLength(0);
  });

  it("inserts a trail", () => {
    createTrail(db);
    expect(db.select().from(trails).all()).toHaveLength(1);
  });
});
