import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="text-3xl font-semibold">Page not found</h1>
      <p className="mt-4 text-zinc-600">This page does not exist, or it moved.</p>
      <Link href="/" className="mt-4 inline-block underline">
        Back to the home page
      </Link>
    </main>
  );
}
