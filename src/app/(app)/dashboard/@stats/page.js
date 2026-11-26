import Link from "next/link";
import { trails } from "@/data/trails";

export default function StatsPanel() {
  const km = trails.reduce((sum, trail) => sum + trail.km, 0);

  return (
    <div>
      <h2 className="font-semibold">Trail stats</h2>
      <p className="mt-2 text-sm">
        {trails.length} trails, {km.toFixed(1)} km in total
      </p>
      <Link href="/dashboard/monthly" className="mt-2 inline-block text-sm underline">
        See monthly stats
      </Link>
    </div>
  );
}
