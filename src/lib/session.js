import "server-only";
import { cookies } from "next/headers";
import { WEEK, cookieOptions, readToken, signToken } from "@/lib/session-token";

const COOKIE = "session";

// Sign a token, and put it in a cookie
export async function createSession(userId) {
  const expires = new Date(Date.now() + WEEK);
  const token = await signToken(userId, { expires });
  (await cookies()).set(COOKIE, token, cookieOptions(expires));
}

// The user id of the session, or null
export async function getSession() {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  const payload = await readToken(token);
  return payload ? { userId: payload.userId } : null;
}

// Logout: remove the cookie
export async function deleteSession() {
  (await cookies()).delete(COOKIE);
}
