import { cookies } from "next/headers";
import { cacheLife } from "next/cache";
import { fetchCount } from "@/lib/api";

export async function getPrivateCount() {
  "use cache: private";
  cacheLife({ stale: 60 });
  const store = await cookies();
  const user = store.get("user")?.value ?? "guest";
  return fetchCount(`private-${user}`);
}

export async function getRemoteCount(user) {
  "use cache: remote";
  cacheLife("hours");
  return fetchCount(`remote-${user}`);
}
