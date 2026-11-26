import { Suspense } from "react";
import { connection } from "next/server";
import Link from "next/link";
import { cacheLife, cacheTag } from "next/cache";
import { endLater, endNow, refreshNow } from "./actions";

const time = () => new Date().toISOString().slice(11, 19);

// Made once: part of the static shell
async function shellStamp() {
  "use cache";
  cacheLife("max");
  return time();
}

// Kept for ten seconds, then made again
async function freshStamp() {
  "use cache";
  cacheLife("quick");
  return time();
}

// A stamp with a broad tag, and a narrow one
async function labStamp(name) {
  "use cache";
  cacheLife("hours");
  cacheTag("lab", `lab:${name}`);
  return time();
}

// Made at request time, then kept by its tags
async function Tagged() {
  await connection();
  return (
    <>
      a: <b data-lab="a">{await labStamp("a")}</b> b:{" "}
      <b data-lab="b">{await labStamp("b")}</b>
    </>
  );
}

async function Cached() {
  return <b data-lab="cached">{await freshStamp()}</b>;
}

// Made for every request
async function Live() {
  await connection();
  return <b data-lab="live">{time()}</b>;
}

export default async function CacheLabPage() {
  return (
    <main className="mx-auto max-w-2xl p-4 md:p-8">
      <h1 className="text-3xl font-semibold">Cache lab</h1>
      <ul className="mt-4 space-y-2">
        <li>
          shell: <b data-lab="shell">{await shellStamp()}</b>
        </li>
        <li>
          <Suspense fallback="tags: ...">
            <Tagged />
          </Suspense>
        </li>
        <li>
          <Suspense fallback="cached: ...">
            cached: <Cached />
          </Suspense>
        </li>
        <li>
          <Suspense fallback="live: ...">
            live: <Live />
          </Suspense>
        </li>
      </ul>
      <Link id="go" href="/cache-lab/nav" className="underline">
        Go to the second page
      </Link>
      <nav className="mt-4 flex gap-4">
        <Link id="plain" href="/cache-lab/topic?name=alpha">
          alpha (default link)
        </Link>
        <Link id="eager" href="/cache-lab/topic?name=beta" prefetch={true}>
          beta (prefetch)
        </Link>
      </nav>
      <div className="mt-6 flex gap-3">
        <form action={endNow}>
          <button id="end-now" type="submit" className="rounded border px-3 py-1">
            updateTag
          </button>
        </form>
        <form action={endLater}>
          <button id="end-later" type="submit" className="rounded border px-3 py-1">
            revalidateTag
          </button>
        </form>
        <form action={refreshNow}>
          <button id="refresh" type="submit" className="rounded border px-3 py-1">
            refresh
          </button>
        </form>
      </div>
    </main>
  );
}
