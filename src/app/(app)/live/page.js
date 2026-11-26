import { Suspense } from "react";
import ConnectivityFallback from "@/components/ConnectivityFallback";
import HikersPanel from "@/components/HikersPanel";
import LiveReviewCount from "@/components/LiveReviewCount";
import LiveReviewStream from "@/components/LiveReviewStream";
import TrailChat from "@/components/TrailChat";

export default function LivePage() {
  return (
    <main className="mx-auto max-w-3xl p-4 md:p-8">
      <h1 className="text-3xl font-semibold">Live</h1>
      <Suspense fallback={<ConnectivityFallback />}>
        <HikersPanel />
      </Suspense>
      <LiveReviewCount />
      <LiveReviewStream />
      <TrailChat />
    </main>
  );
}
