import { trails } from "@/data/trails";
import { coordinates } from "@/data/coordinates";
import TrailMap from "@/components/TrailMap";

export default function MapPage() {
  const points = trails.map(({ slug, name }) => ({ name, position: coordinates[slug] }));

  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="text-3xl font-semibold">Trail map</h1>
      <TrailMap points={points} />
    </main>
  );
}
