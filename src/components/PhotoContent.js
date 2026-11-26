import { notFound } from "next/navigation";
import { getTrail } from "@/lib/trails";
import TrailPhoto from "./TrailPhoto";

export default function PhotoContent({ slug }) {
  const trail = getTrail(slug);

  if (!trail) notFound();

  return (
    <div>
      <TrailPhoto trail={trail} />
      <h1 className="mt-4 text-2xl font-semibold">{trail.name}</h1>
      <p className="text-zinc-600">
        {trail.km} km, {trail.level}
      </p>
    </div>
  );
}
