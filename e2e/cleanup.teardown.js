import { rmSync } from "node:fs";
import Database from "better-sqlite3";
import { test as teardown } from "@playwright/test";

const TEST_USERS = "select id from users where email like 'e2e-%@example.com'";

teardown("delete the users of the tests", async () => {
  const db = new Database("data/trailhead.db");
  const mine = "select photo from trails where slug like 'zzz-e2e-%' and photo is not null";
  for (const { photo } of db.prepare(mine).all()) {
    rmSync(`data/uploads/${photo}`, { force: true });
  }
  db.prepare("delete from trails where slug like 'zzz-e2e-%'").run();
  // The reviews first, then the users
  db.prepare(`delete from reviews where user_id in (${TEST_USERS})`).run();
  const sql = "delete from users where email like 'e2e-%@example.com'";
  const removed = db.prepare(sql).run();
  db.close();
  console.log(`removed ${removed.changes} test users`);
});
