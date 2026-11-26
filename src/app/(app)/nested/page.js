import { Suspense } from "react";
import NestedSection from "@/components/NestedSection";
import PanelSkeleton from "@/components/PanelSkeleton";
import SlowPanel from "@/components/SlowPanel";

export default function NestedPage() {
  return (
    <main className="mx-auto max-w-3xl space-y-4 p-4 md:p-8">
      <h1 className="text-3xl font-semibold">Nested</h1>
      <Suspense fallback={<PanelSkeleton />}>
        <SlowPanel title="Overview" delay={300} />
      </Suspense>
      <Suspense fallback={<PanelSkeleton />}>
        <NestedSection />
      </Suspense>
    </main>
  );
}
