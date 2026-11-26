import { Suspense } from "react";
import { notFound } from "next/navigation";
import { listReviews } from "@/dal/reviews";
import { getTrail, listTrails } from "@/dal/trails";
import { currentName } from "@/lib/personal";

export async function generateStaticParams() {
  const items = await listTrails();
  return items.map((trail) => ({ slug: trail.slug }));
}

// Shared by everybody: part of the static shell
async function TrailInfo({ slug }) {
  const trail = await getTrail(slug);
  if (!trail) notFound();
  return (
    <>
      <h1 className="text-3xl font-semibold">{trail.name}</h1>
      <p className="mt-2 text-muted">{trail.description}</p>
    </>
  );
}

async function Reviews({ slug }) {
  const reviews = await listReviews(slug);
  return <h2 className="mt-6 font-semibold">{`${reviews.length} reviews`}</h2>;
}

// Personal: a hole in the shell
async function Welcome() {
  const name = await currentName();
  return <p className="text-sm">{name ? `Welcome back, ${name}` : "Welcome, visitor"}</p>;
}

export default async function HikePage({ params }) {
  const { slug } = await params;
  return (
    <main className="mx-auto max-w-3xl p-4 md:p-8">
      <Suspense fallback={<p className="text-sm">Welcome...</p>}>
        <Welcome />
      </Suspense>
      <TrailInfo slug={slug} />
      <Reviews slug={slug} />
    </main>
  );
}
