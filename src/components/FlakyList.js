import { fetchFlaky } from "@/lib/api";

export default async function FlakyList() {
  const trails = await fetchFlaky();

  return (
    <ul className="mt-4 space-y-1">
      {trails.map((trail) => (
        <li key={trail.slug}>{trail.name}</li>
      ))}
    </ul>
  );
}
