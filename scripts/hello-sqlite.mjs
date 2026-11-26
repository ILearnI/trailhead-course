import { DatabaseSync } from "node:sqlite";

// A database is a file: this one is in /tmp
const db = new DatabaseSync("/tmp/hello.db");
db.exec("CREATE TABLE IF NOT EXISTS trails (id INTEGER PRIMARY KEY, name TEXT)");
db.exec("INSERT INTO trails (name) VALUES ('Alpine Lake Loop')");
console.log(db.prepare("SELECT * FROM trails").all());
