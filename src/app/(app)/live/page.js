import { Suspense } from "react";
import HikersPanel from "@/components/HikersPanel";

export default function LivePage() {
  return (
    <main className="mx-auto max-w-3xl p-4 md:p-8">
      <h1 className="text-3xl font-semibold">Live</h1>
      <Suspense fallback={<p>Loading...</p>}>
        <HikersPanel />
      </Suspense>
    </main>
  );
}
