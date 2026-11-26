import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

// Words that mean: this checks who is calling
const GUARDS = [
  "verifySession",
  "requirePermission",
  "getCurrentUser",
  "RANGER_TOKEN",
  "REVALIDATE_SECRET",
];

// Open on purpose, and why
const PUBLIC = {
  login: "anyone may try",
  logout: "ends your own session",
  signUp: "anyone may register",
  sendMessage: "the contact form",
  likeTrail: "a public counter",
  suggestTrail: "anonymous suggestions",
  addReview: "the demo review form",
  greet: "a demo",
  openLabSession: "the cookie lab",
};

// Every file under a folder
function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

// The exported functions of a file: [name, code]
function exported(file) {
  const chunks = readFileSync(file, "utf8").split(/\n(?=export )/);
  const pattern = /^export (?:async )?function (\w+)/;
  return chunks
    .map((code) => [code.match(pattern)?.[1], code])
    .filter(([name]) => name);
}

// The layer functions that check, by name
const guarded = new Set();
for (const file of walk("src/dal")) {
  for (const [name, code] of exported(file)) {
    if (GUARDS.some((word) => code.includes(word))) guarded.add(name);
  }
}

// Actions and route handlers: do they check?
let open = 0;
for (const file of walk("src/app")) {
  const code = readFileSync(file, "utf8");
  if (!code.includes('"use server"') && !file.endsWith("/route.js")) continue;
  for (const [name, body] of exported(file)) {
    const words = body.match(/\w+/g);
    const ok = [...GUARDS, ...guarded].some((word) => words.includes(word));
    const why = PUBLIC[name];
    if (!ok && !why) open += 1;
    const path = file.replace("src/app/", "");
    const label = ok ? "guarded" : why ? "public " : "OPEN   ";
    console.log(`${label}  ${path}  ${name}`);
  }
}
console.log(`${open} open entry points`);
process.exitCode = open ? 1 : 0;
