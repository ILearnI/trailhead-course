import { WEEK, isOld, readToken, signToken } from "../src/lib/session-token.js";

// Print what the module says about a token
async function show(label, token) {
  const payload = await readToken(token);
  if (!payload) return console.log(`${label}: refused`);
  console.log(`${label}: user ${payload.userId}, old: ${isOld(payload)}`);
}

await show("fresh", await signToken(1));

const day = 24 * 60 * 60 * 1000;
const fiveDaysAgo = new Date(Date.now() - 5 * day);
await show("five days old", await signToken(1, { issuedAt: fiveDaysAgo }));

const expired = new Date(Date.now() - day);
await show("expired", await signToken(1, { expires: expired }));

const token = await signToken(1);
await show("tampered", token.slice(0, -2) + "xx");
