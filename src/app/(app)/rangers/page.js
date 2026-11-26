import { Suspense } from "react";
import { closeTrail } from "@/app/actions";
import ClosedList from "@/components/ClosedList";
import { trails } from "@/data/trails";

export default function RangersPage() {
  return (
    <main className="mx-auto max-w-xl p-4 md:p-8">
      <h1 className="text-3xl font-semibold">Rangers</h1>
      <form action={closeTrail} id="close-form" className="mt-6 space-y-2">
        <select name="slug" className="block rounded-lg border bg-surface px-3 py-2">
          {trails.map((trail) => (
            <option key={trail.slug} value={trail.slug}>
              {trail.name}
            </option>
          ))}
        </select>
        <button type="submit" className="rounded-lg bg-brand-500 px-4 py-2 text-white">
          Close this trail
        </button>
      </form>
      <Suspense fallback={null}>
        <ClosedList />
      </Suspense>
    </main>
  );
}
