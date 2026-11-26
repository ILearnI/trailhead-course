import { createHash } from "node:crypto";
import { hashPassword, verifyPassword } from "../src/lib/password.js";

const password = "correct horse battery";

// A fast hash gives the same result every time
const fast = (text) => createHash("sha256").update(text).digest("hex");
const same = fast(password) === fast(password);
console.log("sha256 twice:", same ? "same" : "different");

// A salted, slow hash does not
const first = await hashPassword(password);
const second = await hashPassword(password);
console.log("scrypt twice:", first === second ? "same" : "different");
console.log("stored:", first.length, "characters");

// Verify, and measure
const started = performance.now();
console.log("right password:", await verifyPassword(password, first));
console.log("wrong password:", await verifyPassword("wrong horse", first));
const ms = Math.round((performance.now() - started) / 2);
console.log(`one check took about ${ms} ms`);
