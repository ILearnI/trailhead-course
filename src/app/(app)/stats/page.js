import { Suspense } from "react";
import StatsTitle from "@/components/StatsTitle";
import StatsBody from "@/components/StatsBody";

export default function StatsPage() {
  return (
    <main className="mx-auto max-w-3xl p-4 md:p-8">
      <Suspense fallback={<p>...</p>}>
        <StatsTitle />
      </Suspense>
      <Suspense fallback={<p>...</p>}>
        <StatsBody />
      </Suspense>
    </main>
  );
}
