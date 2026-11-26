import Link from "next/link";
import { searchTrails } from "@/dal/trails";

const LEVELS = ["Easy", "Moderate", "Hard"];
const first = (value) => (Array.isArray(value) ? value[0] : value);

export default async function ExploreResults({ searchParams }) {
  const params = await searchParams;
  const q = first(params.q) ?? "";
  const wanted = first(params.level);
  const level = LEVELS.includes(wanted) ? wanted : undefined;
  const page = Number(first(params.page)) || 1;
  const result = await searchTrails({ q, level, page });

  // An address with the current params, and changes
  const href = (changes) => {
    const next = new URLSearchParams();
    for (const [name, value] of Object.entries({ q, level, ...changes })) {
      if (value && value !== 1) next.set(name, String(value));
    }
    return next.size ? `/explore?${next}` : "/explore";
  };

  const label = result.total === 1 ? "trail" : "trails";
  const summary = `${result.total} ${label}, page ${result.page} of ${result.pages}`;

  return (
    <div>
      <form action="/explore" role="search" className="mt-4 flex gap-2">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search trails"
          className="rounded-lg border bg-surface px-3 py-2"
        />
        {level && <input type="hidden" name="level" value={level} />}
        <button type="submit" className="rounded-lg border px-4 py-2">Search</button>
      </form>
      <p className="mt-3 flex gap-3 text-sm">
        <Link href={href({ level: "" })}>All</Link>
        {LEVELS.map((name) => (
          <Link key={name} href={href({ level: name })}>{name}</Link>
        ))}
      </p>
      <p className="mt-4 text-sm text-muted">{summary}</p>
      <ul className="mt-2 space-y-1">
        {result.items.map((trail) => (
          <li key={trail.slug}>
            <Link href={`/explore/${trail.slug}`} className="underline">{trail.name}</Link>
            {` ${trail.km} km, ${trail.level}`}
          </li>
        ))}
      </ul>
      <p className="mt-4 flex gap-4 text-sm">
        {result.page > 1 && (
          <Link href={href({ page: result.page - 1 })}>Previous</Link>
        )}
        {result.page < result.pages && (
          <Link href={href({ page: result.page + 1 })}>Next</Link>
        )}
      </p>
    </div>
  );
}
