// Counts what the build prepared,
// and what it did not
import { readFileSync } from "node:fs";

const read = (file) => JSON.parse(readFileSync(`.next/${file}`, "utf8"));
const prepared = Object.values(read("prerender-manifest.json").routes);
const routes = new Set(Object.values(read("app-path-routes-manifest.json")));

const count = (response) => prepared.filter((page) => page.response === response).length;
// No prepared page: runs for each request
const sources = new Set(prepared.map((page) => page.srcRoute));
const dynamic = [...routes].filter((route) => !sources.has(route));

console.log(`${prepared.length} pages prepared at build time`);
console.log(`  ${count("complete")} static: the whole page is ready`);
console.log(`  ${count("initial")} partial: a static shell, and holes`);
console.log(`  ${count("empty")} blocking: nothing is ready`);
console.log(`${dynamic.length} routes run for each request`);
