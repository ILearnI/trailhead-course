import { Suspense } from "react";
import StudioStats from "@/components/StudioStats";

export const metadata = { title: "Studio" };

export default function Overview() {
  return (
    <section>
      <h1 className="text-3xl font-semibold">Overview</h1>
      <Suspense fallback={<p className="mt-4">Loading the numbers...</p>}>
        <StudioStats />
      </Suspense>
    </section>
  );
}
