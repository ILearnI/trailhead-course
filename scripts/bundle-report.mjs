// Reads the result of "next analyze --output"
import { readFileSync } from "node:fs";

const file = ".next/diagnostics/analyze/data/route-summaries.json";
const routes = JSON.parse(readFileSync(file, "utf8"));
const kb = (bytes) => `${Math.round(bytes / 1024)} KB`;

const rows = routes
  .filter((route) => route.client.compressed_size > 0)
  .sort((a, b) => b.client.compressed_size - a.client.compressed_size);

console.log("Client javascript by route, compressed");
for (const route of rows.slice(0, 5)) {
  console.log(`${kb(route.client.compressed_size).padStart(8)}  ${route.route}`);
}
const last = rows.at(-1);
console.log(`${kb(last.client.compressed_size).padStart(8)}  ${last.route} (smallest)`);
