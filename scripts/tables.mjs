import { DatabaseSync } from "node:sqlite";

const db = new DatabaseSync("data/trailhead.db", { readOnly: true });

const tables = db
  .prepare("SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name")
  .all();
console.log("tables:", tables.map((row) => row.name).join(", "));

// The columns of the trails table
for (const column of db.prepare("PRAGMA table_info(trails)").all()) {
  console.log(`  ${column.name} ${column.type}`);
}
