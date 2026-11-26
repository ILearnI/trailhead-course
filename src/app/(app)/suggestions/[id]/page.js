import { Suspense } from "react";
import SuggestionCard from "@/components/SuggestionCard";

// One sample id, to prepare the shell
export function generateStaticParams() {
  return [{ id: "1" }];
}

export default function SuggestionPage({ params }) {
  return (
    <main className="mx-auto max-w-xl p-4 md:p-8">
      <h1 className="text-3xl font-semibold">Thank you</h1>
      <Suspense fallback={<p className="mt-4">Loading...</p>}>
        <SuggestionCard params={params} />
      </Suspense>
    </main>
  );
}
