import { getTableConfig } from "drizzle-orm/sqlite-core";
import { reviews, trails, users } from "../src/db/schema.js";

// Print every table, with its columns
for (const table of [trails, users, reviews]) {
  const config = getTableConfig(table);
  console.log(config.name);
  for (const column of config.columns) {
    const rules = [];
    if (column.primary) rules.push("primary key");
    if (column.notNull) rules.push("not null");
    if (column.isUnique) rules.push("unique");
    console.log(`  ${column.name}: ${column.getSQLType()} ${rules.join(", ")}`);
  }
}
