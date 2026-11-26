import { redirect } from "next/navigation";
import { trails } from "@/data/trails";

export function generateStaticParams() {
  return trails.map((trail) => ({ slug: trail.slug }));
}

export default async function OldTrailPage({ params }) {
  const { slug } = await params;
  redirect(`/trails/${slug}`);
}
