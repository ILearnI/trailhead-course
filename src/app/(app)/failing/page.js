import { Suspense } from "react";
import FailureReport from "@/components/FailureReport";

export default function FailingPage() {
  return (
    <main className="mx-auto max-w-3xl p-4 md:p-8">
      <h1 className="text-3xl font-semibold">Failing</h1>
      <Suspense fallback={<p>Loading...</p>}>
        <FailureReport />
      </Suspense>
    </main>
  );
}
