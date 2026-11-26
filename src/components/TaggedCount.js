import { getCount } from "@/lib/counts";

export default async function TaggedCount({ searchParams }) {
  const { key = "a" } = await searchParams;
  const { count } = await getCount(key);

  return <p>{`${key}: ${count}`}</p>;
}
