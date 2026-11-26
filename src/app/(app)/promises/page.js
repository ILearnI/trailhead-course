import { Suspense } from "react";
import { fetchTrails } from "@/lib/api";
import TrailNamesClient from "@/components/TrailNamesClient";

export default function PromisesPage() {
  // Start the request, but do not wait for it here
  const promise = fetchTrails(1000);

  return (
    <main className="mx-auto max-w-3xl p-4 md:p-8">
      <h1 className="text-3xl font-semibold">Promises</h1>
      <Suspense fallback={<p className="mt-4">Loading...</p>}>
        <TrailNamesClient promise={promise} />
      </Suspense>
    </main>
  );
}
