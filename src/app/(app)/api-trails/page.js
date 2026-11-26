import { Suspense } from "react";
import ApiTrails from "@/components/ApiTrails";

export default function ApiTrailsPage({ searchParams }) {
  return (
    <main className="mx-auto max-w-3xl p-4 md:p-8">
      <h1 className="text-3xl font-semibold">From the API</h1>
      <Suspense fallback={<p className="mt-4">Loading trails...</p>}>
        <ApiTrails searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
