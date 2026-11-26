// Looks for secrets sent to the browser
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const SECRET_NAME = /SECRET|TOKEN|KEY|PASSWORD/;
const names = Object.keys(process.env);

// A public name must not look secret
const isPublic = (name) => name.startsWith("NEXT_PUBLIC_");
const risky = names.filter((n) => isPublic(n) && SECRET_NAME.test(n));

// Every file of the client bundle
const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? walk(join(dir, entry.name)) : [join(dir, entry.name)],
  );
const files = walk(".next/static").filter((file) => /\.(js|css|html)$/.test(file));
const bundle = files.map((file) => readFileSync(file, "utf8")).join("\n");

// Secrets: private names, long values
const secrets = names.filter((n) => {
  return SECRET_NAME.test(n) && !isPublic(n) && (process.env[n] ?? "").length >= 8;
});
const leaked = secrets.filter((n) => bundle.includes(process.env[n]));

console.log(`${files.length} files sent to the browser`);
console.log(`${secrets.length} secrets checked: ${leaked.length} found`);
for (const name of risky) console.log(`  public name looks secret: ${name}`);
for (const name of leaked) console.log(`  LEAKED: ${name}`);
process.exit(leaked.length + risky.length > 0 ? 1 : 0);
