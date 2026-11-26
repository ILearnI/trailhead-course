import "server-only";
import { cache } from "react";
import { forbidden, redirect, unauthorized } from "next/navigation";
import { findUserById } from "@/dal/users";
import { can } from "@/lib/permissions";
import { getSession } from "@/lib/session";

// The signed in user id, or a redirect to the login
export const verifySession = cache(async () => {
  const session = await getSession();
  if (!session) redirect("/login");
  return { userId: session.userId };
});

// The user of the session, checked in the database
export const getCurrentUser = cache(async () => {
  const { userId } = await verifySession();
  const user = await findUserById(userId);
  if (!user) unauthorized();
  return user;
});

// The user, if they have the permission
export async function requirePermission(permission) {
  const user = await getCurrentUser();
  if (!can(user, permission)) forbidden();
  return user;
}
