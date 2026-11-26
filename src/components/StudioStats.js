import { getStudioStats } from "@/dal/studio-stats";

function Card({ label, value }) {
  return (
    <section aria-label={label} className="rounded-xl border p-4">
      <h2 className="text-sm text-zinc-500">{label}</h2>
      <p className="mt-1 text-3xl font-semibold">{value}</p>
    </section>
  );
}

export default async function StudioStats() {
  const stats = await getStudioStats();
  const average = stats.average === null ? "–" : stats.average.toFixed(1);
  return (
    <>
      <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3">
        <Card label="Trails" value={stats.trails} />
        <Card label="Reviews" value={stats.reviews} />
        <Card label="Average rating" value={average} />
        <Card label="Reviews this week" value={stats.lastWeek} />
        <Card label="Trails without reviews" value={stats.unreviewed} />
      </div>
      <h2 className="mt-8 text-xl font-semibold">Most reviewed</h2>
      <table className="mt-2 w-full text-left text-sm">
        <tbody>
          {stats.top.map((row) => (
            <tr key={row.slug}>
              <td className="py-1">{row.name}</td>
              <td>{row.reviews} reviews</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-4 text-sm text-zinc-500">Numbers of {stats.at} UTC</p>
    </>
  );
}
