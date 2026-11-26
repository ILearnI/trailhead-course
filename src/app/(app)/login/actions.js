"use server";

import { redirect } from "next/navigation";
import { findUserForLogin } from "@/dal/users";
import { verifyPassword } from "@/lib/password";
import { createSession, deleteSession } from "@/lib/session";
import { rateLimit } from "@/lib/rate-limit";
import { safeNext } from "@/lib/safe-next";

// A hash of nobody: same work, always false
const NOBODY = `${"00".repeat(16)}:${"00".repeat(64)}`;
const WRONG = "Wrong email or password";

export async function login(prevState, formData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  // Five attempts a minute for each email
  const limit = rateLimit(`login:${email}`, { limit: 5, windowMs: 60_000 });
  if (!limit.ok) {
    return { error: `Too many attempts. Try again in ${limit.retryAfter} seconds`, email };
  }
  const user = await findUserForLogin(email);
  const valid = await verifyPassword(password, user?.passwordHash ?? NOBODY);
  if (!user || !valid) return { error: WRONG, email };
  await createSession(user.id);
  redirect(safeNext(formData.get("next")));
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
