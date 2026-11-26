import Link from "next/link";
import { requirePermission } from "@/dal/auth";
import { listTrails } from "@/dal/trails";

export const metadata = { title: "Studio: trails" };

export default async function StudioTrails() {
  await requirePermission("trail:write");
  const trails = await listTrails();
  return (
    <section>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Trails</h1>
        <Link href="/studio/trails/new" className="rounded-lg border px-3 py-1">
          New trail
        </Link>
      </div>
      <table className="mt-4 w-full text-left text-sm">
        <tbody>
          {trails.map((trail) => (
            <tr key={trail.slug}>
              <td className="py-1">{trail.name}</td>
              <td>{trail.region}</td>
              <td>{trail.level}</td>
              <td>{trail.km} km</td>
              <td>
                <Link href={`/studio/trails/${trail.slug}/edit`}>Edit</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
