import { requirePermission } from "@/dal/auth";
import { listTrails } from "@/dal/trails";

export const metadata = { title: "Studio: trails" };

export default async function StudioTrails() {
  await requirePermission("trail:write");
  const trails = await listTrails();
  return (
    <section>
      <h1 className="text-3xl font-semibold">Trails</h1>
      <ul className="mt-4 list-disc pl-5">
        {trails.map((trail) => (
          <li key={trail.slug}>{trail.name}</li>
        ))}
      </ul>
    </section>
  );
}
