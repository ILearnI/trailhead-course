import { Suspense } from "react";
import ExploreResults from "@/components/ExploreResults";

export default function ExplorePage({ searchParams }) {
  return (
    <main className="mx-auto max-w-3xl p-4 md:p-8">
      <h1 className="text-3xl font-semibold">Explore</h1>
      <Suspense fallback={<p className="mt-4">Loading...</p>}>
        <ExploreResults searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
