import { Suspense } from "react";
import MyReviews from "@/components/MyReviews";

export const metadata = { title: "Your reviews" };

export default function MyReviewsPage() {
  return (
    <main className="mx-auto max-w-2xl p-4 md:p-8">
      <h1 className="text-3xl font-semibold">Your reviews</h1>
      <Suspense fallback={<p className="mt-4">Loading...</p>}>
        <MyReviews />
      </Suspense>
    </main>
  );
}
