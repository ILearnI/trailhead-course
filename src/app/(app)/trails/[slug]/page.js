import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import ReviewCount from "@/components/ReviewCount";
import RatingSummary from "@/components/RatingSummary";
import TrailWeather from "@/components/TrailWeather";
import RatingStars from "@/components/RatingStars";
import TrailBadge from "@/components/TrailBadge";
import Collapsible from "@/components/Collapsible";
import ReviewPreview from "@/components/ReviewPreview";
import TrailTips from "@/components/TrailTips";
import Tabs from "@/components/Tabs";
import BackButton from "@/components/BackButton";
import { trails } from "@/data/trails";
import { getTrail } from "@/dal/trails";
import { trailMetadata } from "@/lib/trail-seo";
import { listReviews } from "@/dal/reviews";
import { trailJsonLd } from "@/lib/json-ld";
import JsonLd from "@/components/JsonLd";
import TrailThumb from "@/components/TrailThumb";
import DirectionalTransition from "@/components/DirectionalTransition";

export function generateStaticParams() {
  return trails.map((trail) => ({ slug: trail.slug }));
}

// The metadata of one trail, from the data layer
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const trail = await getTrail(slug);
  return trail ? trailMetadata(trail) : { title: "Trail not found" };
}

export default async function TrailPage({ params }) {
  const { slug } = await params;
  if (slug !== slug.toLowerCase()) redirect(`/trails/${slug.toLowerCase()}`);

  const trail = trails.find((t) => t.slug === slug);

  if (!trail) notFound();
  const record = await getTrail(slug);
  const reviews = await listReviews(slug);

  return (
    <DirectionalTransition className="mx-auto max-w-3xl p-8">
      <Link href="/trails" transitionTypes={["nav-back"]} className="text-sm underline">
        All trails
      </Link>
      <BackButton />
      <TrailThumb trail={trail} size="mt-4 size-40 text-6xl" />
      <h1 className="text-3xl font-semibold">{trail.name}</h1>
      <p className="mt-2 text-zinc-600">
        {trail.km} km in the {trail.region}. Level: {trail.level}.
      </p>
      <ReviewCount slug={slug} />
      <RatingSummary reviews={reviews} />
      <TrailWeather region={trail.region} />
      <TrailBadge name={trail.name} region={trail.region} />
      <Collapsible title="the latest reviews">
        <ReviewPreview slug={slug} />
      </Collapsible>
      <Tabs
        tabs={[
          { label: "Tips", content: <TrailTips level={trail.level} /> },
          { label: "Reviews", content: <ReviewPreview slug={slug} /> },
          { label: "Rate", content: <RatingStars /> },
        ]}
      />
      <Link href={`/trails/${slug}/reviews`} className="mt-4 inline-block underline">
        Read the reviews
      </Link>
      {record && <JsonLd data={trailJsonLd(record, reviews)} />}
    </DirectionalTransition>
  );
}
