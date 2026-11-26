"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import TrailList from "./TrailList";

const levels = ["Easy", "Moderate", "Hard"];

export default function TrailBrowser({ items }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const level = searchParams.get("level");
  const [short, setShort] = useState(false);

  function setLevel(next) {
    const params = new URLSearchParams(searchParams.toString());
    if (next) params.set("level", next);
    else params.delete("level");
    router.push(`${pathname}?${params.toString()}`);
  }

  const shown = level ? items.filter((trail) => trail.level === level) : items;
  const visible = short ? shown.filter((trail) => trail.km < 10) : shown;
  return (
    <div>
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => setLevel(null)}
          className="rounded border px-3 py-1 text-sm"
        >
          All
        </button>
        {levels.map((name) => (
          <button
            key={name}
            onClick={() => setLevel(name)}
            className="rounded border px-3 py-1 text-sm"
          >
            {name}
          </button>
        ))}
      </div>
      <label className="mt-3 flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={short}
          onChange={(event) => setShort(event.target.checked)}
        />
        Only trails under 10 km
      </label>
      <p className="mt-2 text-sm text-zinc-500">
        {visible.length} trails{level ? `, level ${level}` : ""}
      </p>
      <TrailList items={visible} />
    </div>
  );
}
