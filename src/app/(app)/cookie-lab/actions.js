"use server";

import { createSession } from "@/lib/session";

// A lab only: a session for user 1
export async function openLabSession() {
  await createSession(1);
}
