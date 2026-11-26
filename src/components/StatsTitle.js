import { getStats } from "@/lib/stats";

export default async function StatsTitle() {
  const stats = await getStats("cedar-falls");

  return <h2 className="text-xl font-semibold">{`title: ${stats.reads}`}</h2>;
}
