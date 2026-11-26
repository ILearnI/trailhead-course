import { Suspense } from "react";
import SpotsReport from "@/components/SpotsReport";

export default function SpotsPage({ searchParams }) {
  return (
    <main className="mx-auto max-w-3xl p-4 md:p-8">
      <h1 className="text-3xl font-semibold">Spots</h1>
      <Suspense fallback={<p className="mt-4">Checking...</p>}>
        <SpotsReport searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
