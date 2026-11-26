import { trails } from "@/data/trails";
import { Suspense } from "react";
import ReviewSection from "@/components/ReviewSection";

export function generateStaticParams() {
  return trails.map((trail) => ({ slug: trail.slug }));
}

export default async function ReviewsPage({ params }) {
  const { slug } = await params;
  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="text-2xl font-semibold">Reviews</h1>
      <Suspense fallback={<p className="mt-4">Loading...</p>}>
        <ReviewSection slug={slug} />
      </Suspense>
    </main>
  );
}
