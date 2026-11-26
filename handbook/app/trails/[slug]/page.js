import { notFound } from "next/navigation";
import { trails } from "../../../../src/data/trails";

// Every page is made at build time
export function generateStaticParams() {
  return trails.map((trail) => ({ slug: trail.slug }));
}

export default async function TrailPage({ params }) {
  const { slug } = await params;
  const trail = trails.find((item) => item.slug === slug);
  if (!trail) notFound();
  return (
    <main>
      <h1>{trail.name}</h1>
      <p>{trail.km} km, {trail.level}</p>
    </main>
  );
}
