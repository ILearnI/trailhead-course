import { describeRating, starLabel, summarize } from "@/lib/ratings";

// From the best to the worst
const STARS = [5, 4, 3, 2, 1];

// The width of a bar, in percent
const percent = (part, all) => `${(part / all) * 100}%`;

export default function RatingSummary({ reviews }) {
  const summary = summarize(reviews);

  return (
    <section aria-label="Ratings" className="mt-4">
      <p className="font-medium">{describeRating(summary)}</p>
      {summary.count > 0 && (
        <ul className="mt-2 space-y-1 text-sm">
          {STARS.map((stars) => (
            <li key={stars} className="flex items-center gap-2">
              <span className="w-16">{starLabel(stars)}</span>
              <span aria-hidden="true" className="h-2 flex-1 rounded bg-zinc-200">
                <span
                  className="block h-2 rounded bg-emerald-700"
                  style={{ width: percent(summary.distribution[stars], summary.count) }}
                />
              </span>
              <span>{summary.distribution[stars]}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
