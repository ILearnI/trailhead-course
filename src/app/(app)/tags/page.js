import { Suspense } from "react";
import TaggedCount from "@/components/TaggedCount";

export default function TagsPage({ searchParams }) {
  return (
    <main className="mx-auto max-w-3xl p-4 md:p-8">
      <h1 className="text-3xl font-semibold">Tags</h1>
      <Suspense fallback={<p>Loading...</p>}>
        <TaggedCount searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
