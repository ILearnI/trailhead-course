import { Suspense } from "react";
import BuiltAt from "@/components/BuiltAt";
import Now from "@/components/Now";

export default function ClockPage() {
  return (
    <main className="mx-auto max-w-3xl p-4 md:p-8">
      <h1 className="text-3xl font-semibold">Clock</h1>
      <BuiltAt />
      <Suspense fallback={<p className="mt-4">Reading the clock...</p>}>
        <Now />
      </Suspense>
    </main>
  );
}
