import Link from "next/link";

export default function TrailNotFound() {
  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="text-2xl font-semibold">We could not find that trail</h1>
      <Link href="/trails" className="mt-4 inline-block underline">
        Browse all trails
      </Link>
    </main>
  );
}
