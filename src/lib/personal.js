import "server-only";
import { findUserById } from "@/dal/users";
import { getSession } from "@/lib/session";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// The name of the visitor: a slow call
export async function currentName() {
  const session = await getSession();
  // Pretend that the service takes two seconds
  await sleep(2000);
  const user = session ? await findUserById(session.userId) : null;
  return user?.name ?? null;
}
