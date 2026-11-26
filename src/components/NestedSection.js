import { Suspense } from "react";
import { fetchTrails } from "@/lib/api";
import PanelSkeleton from "@/components/PanelSkeleton";
import SlowPanel from "@/components/SlowPanel";

export default async function NestedSection() {
  await fetchTrails(900);

  return (
    <div className="space-y-4">
      <section className="h-24 rounded-xl border p-4">Stats ready</section>
      <Suspense fallback={<PanelSkeleton />}>
        <SlowPanel title="Details" delay={1800} />
      </Suspense>
    </div>
  );
}
