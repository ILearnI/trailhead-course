import { Suspense } from "react";
import { getClock, getReviewCount } from "@/lib/legacy-stats";

async function Stats() {
  return (
    <p>
      {`reviews: ${await getReviewCount()}, clock: ${await getClock()}`}
    </p>
  );
}

export default function LegacyPage() {
  return (
    <main className="mx-auto max-w-2xl p-4 md:p-8">
      <h1 className="text-3xl font-semibold">Legacy</h1>
      <Suspense fallback="...">
        <Stats />
      </Suspense>
    </main>
  );
}
