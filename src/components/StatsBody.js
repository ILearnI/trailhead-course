import { getStats } from "@/lib/stats";

export default async function StatsBody() {
  const stats = await getStats("cedar-falls");

  return <p className="mt-2">{`body: ${stats.reads}`}</p>;
}
