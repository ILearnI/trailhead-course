import { SignJWT, jwtVerify } from "jose";

const key = new TextEncoder().encode(process.env.SESSION_SECRET);
export const WEEK = 7 * 24 * 60 * 60 * 1000;

// Sign a session token for a user
export async function signToken(userId, options = {}) {
  const issued = options.issuedAt ?? new Date();
  const expires = options.expires ?? new Date(issued.getTime() + WEEK);
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt(issued)
    .setExpirationTime(expires)
    .sign(key);
}

// The flags of the session cookie
export function cookieOptions(expires) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires,
    path: "/",
  };
}

// The payload of a valid token, or null
export async function readToken(token) {
  try {
    const { payload } = await jwtVerify(token, key);
    return payload;
  } catch {
    return null;
  }
}

// True when less than half of the life is left
export function isOld(payload) {
  const life = payload.exp - payload.iat;
  const left = payload.exp - Date.now() / 1000;
  return left < life / 2;
}
