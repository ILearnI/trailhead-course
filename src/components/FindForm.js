"use client";

import Link from "next/link";
import { useActionState } from "react";
import { findByWords } from "@/app/(app)/find/actions";

// The filters that were understood
function describe({ region, level, maxKm }) {
  const parts = [level, region, maxKm ? `up to ${maxKm} km` : null].filter(Boolean);
  return parts.length ? parts.join(" · ") : "No filter";
}

export default function FindForm() {
  const [state, action, pending] = useActionState(findByWords, {});

  return (
    <section aria-label="Search" className="mt-6">
      <form id="find-form" action={action} className="space-y-2">
        <label htmlFor="sentence" className="block text-sm">
          What are you looking for?
        </label>
        <textarea
          id="sentence"
          name="sentence"
          defaultValue={state.sentence}
          rows={2}
          className="block w-full rounded-lg border bg-surface px-3 py-2"
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-brand-500 px-4 py-2 text-white disabled:opacity-60"
        >
          {pending ? "Searching..." : "Find trails"}
        </button>
      </form>
      {state.error && <p role="alert" className="mt-4">{state.error}</p>}
      {state.intent && (
        <div className="mt-4">
          <p className="text-sm text-zinc-600">
            {`We understood: ${describe(state.intent)}`}
          </p>
          {state.trails.length === 0 ? (
            <p className="mt-2">No trail matches.</p>
          ) : (
            <ul className="mt-2 list-disc pl-6">
              {state.trails.map((trail) => (
                <li key={trail.slug}>
                  <Link href={`/trails/${trail.slug}`} className="underline">
                    {trail.name}
                  </Link>
                  {`, ${trail.km} km, ${trail.level}`}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}
