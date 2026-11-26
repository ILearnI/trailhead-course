import { Suspense } from "react";
import { cacheLife } from "next/cache";
import { count } from "@/lib/calls";
import { trails } from "@/data/trails";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Built for these paths, the others on demand
export function generateStaticParams() {
  return [{ slug: trails[0].slug }];
}

async function getCard(slug) {
  "use cache";
  cacheLife("pinned");
  count(`isr:${slug}`);
  await sleep(2000);
  const trail = trails.find((t) => t.slug === slug);
  const at = new Date().toISOString().slice(11, 19);
  return `${trail?.name ?? "Unknown"} made at ${at}`;
}

async function Card({ params }) {
  const { slug } = await params;
  return <p data-isr="card">{await getCard(slug)}</p>;
}

export default function IsrPage({ params }) {
  return (
    <main className="mx-auto max-w-2xl p-4 md:p-8">
      <h1 className="text-3xl font-semibold">ISR lab</h1>
      <Suspense fallback={<p data-isr="loading">Loading...</p>}>
        <Card params={params} />
      </Suspense>
    </main>
  );
}
