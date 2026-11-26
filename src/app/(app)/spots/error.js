"use client";

export default function SpotsError({ retry }) {
  return (
    <main className="mx-auto max-w-3xl p-4 md:p-8">
      <h2 className="text-xl font-semibold">Something went wrong</h2>
      <button onClick={() => retry()} className="mt-4 rounded-lg border px-4 py-2">
        Try again
      </button>
    </main>
  );
}
