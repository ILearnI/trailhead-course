import { trails } from "@/data/trails";
import TrailList from "../_components/TrailList";

export default function PopularTrailsPage() {
  const popular = [...trails].sort((a, b) => b.km - a.km).slice(0, 3);

  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="text-3xl font-semibold">Popular trails</h1>
      <TrailList items={popular} />
    </main>
  );
}
