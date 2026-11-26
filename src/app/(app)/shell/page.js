import { Suspense } from "react";
import SlowPanel from "@/components/SlowPanel";
import PanelSkeleton from "@/components/PanelSkeleton";

export default function ShellPage() {
  return (
    <main className="mx-auto max-w-3xl space-y-4 p-4 md:p-8">
      <h1 className="text-3xl font-semibold">Shell</h1>
      <Suspense fallback={<PanelSkeleton />}>
        <SlowPanel title="Conditions" delay={1500} />
      </Suspense>
      <Suspense fallback={<PanelSkeleton />}>
        <SlowPanel title="Hikers" delay={800} />
      </Suspense>
    </main>
  );
}
