import { Suspense } from "react";
import ScopeCounts from "@/components/ScopeCounts";

export default function ScopesPage() {
  return (
    <main className="mx-auto max-w-3xl p-4 md:p-8">
      <h1 className="text-3xl font-semibold">Scopes</h1>
      <Suspense fallback={<p>Loading...</p>}>
        <ScopeCounts />
      </Suspense>
    </main>
  );
}
