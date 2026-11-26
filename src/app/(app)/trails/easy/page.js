import { trails } from "@/data/trails";
import TrailList from "../_components/TrailList";

export default function EasyTrailsPage() {
  const easy = trails.filter((trail) => trail.level === "Easy");

  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="text-3xl font-semibold">Easy trails</h1>
      <TrailList items={easy} />
    </main>
  );
}
