import Link from "next/link";
import { cacheLife, cacheTag } from "next/cache";
import { endNav, refreshNow } from "../actions";

// Browser keeps it 2 min, the server 5 s
async function stamp() {
  "use cache";
  cacheLife("pinned");
  cacheTag("nav");
  return new Date().toISOString().slice(11, 19);
}

export default async function NavPage() {
  return (
    <main className="mx-auto max-w-2xl p-4 md:p-8">
      <h1 className="text-3xl font-semibold">Second page</h1>
      <p>
        stamp: <b data-nav="stamp">{await stamp()}</b>
      </p>
      <Link id="back" href="/cache-lab" className="underline">
        Back to the lab
      </Link>
      <form action={refreshNow} className="mt-4">
        <button id="refresh" type="submit" className="rounded border px-3 py-1">
          refresh
        </button>
      </form>
      <form action={endNav} className="mt-4">
        <button id="end" type="submit" className="rounded border px-3 py-1">
          updateTag
        </button>
      </form>
    </main>
  );
}
