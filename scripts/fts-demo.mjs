import { DatabaseSync } from "node:sqlite";

// A full text index lives in a virtual table
const db = new DatabaseSync(":memory:");
db.exec("CREATE VIRTUAL TABLE docs USING fts5(name, description)");
const insert = db.prepare("INSERT INTO docs (name, description) VALUES (?, ?)");
insert.run("Alpine Lake Loop", "A loop around a glacial lake, under the peaks.");
insert.run("Cedar Falls", "A short walk through old cedars to a waterfall.");
insert.run("Salt Marsh Walk", "A flat boardwalk through the marsh, full of birds.");

const search = (query) =>
  db
    .prepare("SELECT name FROM docs WHERE docs MATCH ? ORDER BY rank")
    .all(query)
    .map((row) => row.name)
    .join(", ") || "nothing";

console.log("lake:", search("lake"));
console.log("wate*:", search("wate*"));
console.log("birds OR peaks:", search("birds OR peaks"));
console.log("dog:", search("dog"));
