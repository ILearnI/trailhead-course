import { signToken } from "../src/lib/session-token.js";

// "old": a token issued five days ago
const old = process.argv[2] === "old";
const issuedAt = old ? new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) : undefined;
const userId = Number(process.env.USER_ID ?? 1);
console.log(`session=${await signToken(userId, { issuedAt })}`);
