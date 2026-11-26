import { cacheLife } from "next/cache";
import { fetchCount } from "@/lib/api";

export default async function CachedCount({ name }) {
  "use cache";
  cacheLife({ stale: 30, revalidate: 2, expire: 600 });

  const { count } = await fetchCount(name);
  return <li>{`${name}: ${count}`}</li>;
}
