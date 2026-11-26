import { fetchTrails } from "@/lib/api";

export default async function SlowPanel({ title, delay }) {
  const trails = await fetchTrails(delay);

  return (
    <section className="h-24 rounded-xl border p-4">
      <h2 className="font-semibold">{title}</h2>
      <p className="text-sm text-muted">{`${trails.length} trails, after ${delay} ms`}</p>
    </section>
  );
}
