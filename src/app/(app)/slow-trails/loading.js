export default function Loading() {
  return (
    <main className="mx-auto max-w-3xl p-4 md:p-8">
      <h1 className="text-3xl font-semibold">Slow trails</h1>
      <div className="mt-4 space-y-2">
        <div className="h-5 w-48 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-5 w-40 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-5 w-44 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
      </div>
    </main>
  );
}
