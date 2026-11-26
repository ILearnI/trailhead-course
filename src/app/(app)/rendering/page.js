import { Suspense } from "react";
import TrailCountLive from "@/components/TrailCountLive";

// Warn me if this page would make a visitor wait
export const instant = true;

export default function RenderingPage() {
  return (
    <main className="mx-auto max-w-3xl p-4 md:p-8">
      <h1 className="text-3xl font-semibold">Rendering</h1>
      <Suspense fallback={<p className="mt-4">Counting...</p>}>
        <TrailCountLive />
      </Suspense>
    </main>
  );
}
