import { fetchTrails } from "@/lib/api";

export default async function ApiTrails({ searchParams }) {
  const { level } = await searchParams;
  const all = await fetchTrails();
  const trails = level ? all.filter((t) => t.level === level) : all;

  return (
    <ul className="mt-4 space-y-2">
      {trails.map((trail) => (
        <li key={trail.slug}>
          {trail.name}, {trail.km} km
        </li>
      ))}
    </ul>
  );
}
