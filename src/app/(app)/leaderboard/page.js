import { topTrails } from "@/dal/trails";

export default async function LeaderboardPage() {
  const board = await topTrails(5);

  return (
    <main className="mx-auto max-w-3xl p-4 md:p-8">
      <h1 className="text-3xl font-semibold">Leaderboard</h1>
      <ol className="mt-4 list-decimal space-y-1 pl-6">
        {board.map((trail) => (
          <li key={trail.slug}>
            {`${trail.name}: ${trail.average.toFixed(1)} (${trail.reviews} reviews)`}
          </li>
        ))}
      </ol>
    </main>
  );
}
