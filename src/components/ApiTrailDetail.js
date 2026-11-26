import { notFound } from "next/navigation";
import { fetchCount, fetchTrail, fetchTrails } from "@/lib/api";

export default async function ApiTrailDetail({ params }) {
  // params is a promise: await it
  const { slug } = await params;
  // Start both requests, then wait for both
  const [trail, all] = await Promise.all([
    fetchTrail(slug, 600),
    fetchTrails(600),
  ]);
  if (!trail) notFound();
  // Needs the trail, so it must wait for it
  const activity = await fetchCount(`region-${trail.region}`);

  return (
    <div className="mt-4">
      <h2 className="text-xl font-semibold">{trail.name}</h2>
      <p>{`${trail.km} km, ${trail.level}`}</p>
      <p className="mt-4 text-sm text-muted">
        {`${all.length - 1} other trails`}
      </p>
      <p className="text-sm text-muted">
        {`Region activity: ${activity.count}`}
      </p>
    </div>
  );
}
