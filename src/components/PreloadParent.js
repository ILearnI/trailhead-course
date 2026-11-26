import { Suspense } from "react";
import { fetchTrails } from "@/lib/api";
import StatsBody from "@/components/StatsBody";
import { preloadStats } from "@/lib/stats";

export default async function PreloadParent() {
  // Start the child's request now
  preloadStats("cedar-falls");
  const trails = await fetchTrails(600);

  return (
    <div>
      <p>{`${trails.length} trails`}</p>
      <Suspense fallback={<p>...</p>}>
        <StatsBody />
      </Suspense>
    </div>
  );
}
