import { Suspense } from "react";
import { fetchTrails } from "@/lib/api";
import TrailListSkeleton from "@/components/TrailListSkeleton";
import TrailList from "@/app/(app)/trails/_components/TrailList";

async function Feed() {
  const trails = await fetchTrails(1500);
  return <TrailList items={trails} />;
}

export default function TrailFeedPage() {
  return (
    <main className="mx-auto max-w-5xl p-4 md:p-8">
      <h1 className="text-3xl font-semibold">Trail feed</h1>
      <Suspense fallback={<TrailListSkeleton />}>
        <Feed />
      </Suspense>
    </main>
  );
}
