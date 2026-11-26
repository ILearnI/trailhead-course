import { Suspense } from "react";
import { trails } from "@/data/trails";
import TrailBrowser from "./_components/TrailBrowser";
import FeaturedTrail from "@/components/FeaturedTrail";
import DirectionalTransition from "@/components/DirectionalTransition";

export const metadata = {
  title: "Trails",
  description: "Every trail of Trailhead, with its level and length.",
  alternates: { canonical: "/trails" },
};

export default function TrailsPage() {
  return (
    <DirectionalTransition className="mx-auto max-w-5xl p-4 md:p-8">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold">All trails</h1>
      <FeaturedTrail />
      <Suspense fallback={<p className="mt-4 text-sm">Loading filters...</p>}>
        <TrailBrowser items={trails} />
      </Suspense>
    </DirectionalTransition>
  );
}
