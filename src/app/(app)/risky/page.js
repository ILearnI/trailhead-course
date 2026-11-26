import { Suspense } from "react";
import FlakyList from "@/components/FlakyList";

export default function RiskyPage() {
  return (
    <main className="mx-auto max-w-3xl p-4 md:p-8">
      <h1 className="text-3xl font-semibold">Risky</h1>
      <Suspense fallback={<p className="mt-4">Loading...</p>}>
        <FlakyList />
      </Suspense>
    </main>
  );
}
