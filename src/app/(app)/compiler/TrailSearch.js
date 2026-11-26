"use client";

import { useState } from "react";
import SlowList from "./SlowList";

export default function TrailSearch() {
  const [query, setQuery] = useState("");

  return (
    <section className="mt-6">
      <input
        aria-label="Search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        className="rounded-lg border px-3 py-2"
      />
      <p className="mt-2 text-sm">You typed: {query}</p>
      <SlowList count={200} />
    </section>
  );
}
