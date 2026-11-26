import { cacheLife, cacheTag } from "next/cache";
import { fetchCount } from "@/lib/api";

export async function getUserCount(user) {
  "use cache";
  cacheLife("hours");
  cacheTag(`user-${user}`);

  return fetchCount(`profile-${user}`);
}
