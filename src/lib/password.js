import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);
const KEY_LENGTH = 64;

// Hash a password: salt, then a slow hash
export async function hashPassword(password) {
  const salt = randomBytes(16);
  const key = await scryptAsync(password, salt, KEY_LENGTH);
  return `${salt.toString("hex")}:${key.toString("hex")}`;
}

// Check a password against a stored hash
export async function verifyPassword(password, stored) {
  const [saltHex, keyHex] = stored.split(":");
  const salt = Buffer.from(saltHex, "hex");
  const key = await scryptAsync(password, salt, KEY_LENGTH);
  return timingSafeEqual(key, Buffer.from(keyHex, "hex"));
}
