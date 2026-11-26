import Database from "better-sqlite3";

// For the tests only: give a role to a user
export function setRole(email, role) {
  const db = new Database("data/trailhead.db");
  db.prepare("update users set role = ? where email = ?").run(role, email);
  db.close();
}
