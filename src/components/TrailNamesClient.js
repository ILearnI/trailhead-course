"use client";

import { use, useState } from "react";

export default function TrailNamesClient({ promise }) {
  // use() suspends until the promise resolves
  const trails = use(promise);
  const [query, setQuery] = useState("");
  const shown = trails.filter((trail) =>
    trail.name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="mt-4">
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Filter the trails"
        className="rounded-lg border bg-surface px-3 py-2"
      />
      <ul className="mt-4 space-y-1">
        {shown.map((trail) => (
          <li key={trail.slug}>{trail.name}</li>
        ))}
      </ul>
    </div>
  );
}
