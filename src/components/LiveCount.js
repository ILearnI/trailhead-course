import { fetchCount } from "@/lib/api";

export default async function LiveCount() {
  const { count } = await fetchCount("live");
  return <li>{`live: ${count}`}</li>;
}
