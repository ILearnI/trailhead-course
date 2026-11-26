import { Suspense } from "react";
import ApiTrailDetail from "@/components/ApiTrailDetail";
import { fetchTrails } from "@/lib/api";

// Stop the server code after 10 seconds
export const maxDuration = 10;

// Prepare a shell for each known slug
export async function generateStaticParams() {
  const trails = await fetchTrails();
  return trails.map((trail) => ({ slug: trail.slug }));
}

export default function ApiTrailPage({ params }) {
  return (
    <main className="mx-auto max-w-3xl p-4 md:p-8">
      <Suspense fallback={<p>Loading the trail...</p>}>
        <ApiTrailDetail params={params} />
      </Suspense>
    </main>
  );
}
