import { trails } from "@/data/trails";

export default function TrailStats() {
  const km = trails.reduce((sum, trail) => sum + trail.km, 0);

  return <p className="mt-2 text-sm text-zinc-500">{`${trails.length} trails, ${km.toFixed(1)} km in total`}</p>;
}
