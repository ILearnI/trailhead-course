import { fetchTrails } from "@/lib/api";

export default async function SlowTrailsPage() {
  const trails = await fetchTrails(1500);

  return (
    <main className="mx-auto max-w-3xl p-4 md:p-8">
      <h1 className="text-3xl font-semibold">Slow trails</h1>
      <ul className="mt-4 space-y-1">
        {trails.map((trail) => (
          <li key={trail.slug}>{trail.name}</li>
        ))}
      </ul>
    </main>
  );
}
