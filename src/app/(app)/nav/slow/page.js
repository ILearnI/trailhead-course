import { Suspense } from "react";
import PanelSkeleton from "@/components/PanelSkeleton";
import TrailCountLine from "@/components/TrailCountLine";

export default function SlowPage() {
  return (
    <main className="mx-auto max-w-3xl p-4 md:p-8">
      <h1 className="text-3xl font-semibold">Slow</h1>
      <Suspense fallback={<PanelSkeleton />}>
        <TrailCountLine />
      </Suspense>
    </main>
  );
}
