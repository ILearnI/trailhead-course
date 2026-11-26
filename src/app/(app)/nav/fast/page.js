import { Suspense } from "react";
import PanelSkeleton from "@/components/PanelSkeleton";
import SlowPanel from "@/components/SlowPanel";

export default function FastPage() {
  return (
    <main className="mx-auto max-w-3xl p-4 md:p-8">
      <h1 className="text-3xl font-semibold">Fast</h1>
      <Suspense fallback={<PanelSkeleton />}>
        <SlowPanel title="Details" delay={1500} />
      </Suspense>
    </main>
  );
}
