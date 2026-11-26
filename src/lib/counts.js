import { cacheLife, cacheTag } from "next/cache";
import { fetchCount } from "@/lib/api";

export async function getCount(key) {
  "use cache";
  cacheLife("hours");
  // A general tag, and one for this key
  cacheTag("counts", `count-${key}`);

  return fetchCount(key);
}
