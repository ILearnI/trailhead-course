import Link from "next/link";

export default function NavPage() {
  return (
    <main className="mx-auto max-w-3xl p-4 md:p-8">
      <h1 className="text-3xl font-semibold">Navigation</h1>
      <ul className="mt-4 space-y-2 underline">
        <li>
          <Link href="/nav/fast">Fast page</Link>
        </li>
        <li>
          <Link href="/nav/slow">Slow page</Link>
        </li>
      </ul>
    </main>
  );
}
