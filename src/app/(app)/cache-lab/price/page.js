import { Suspense } from "react";
import { cacheLife, cacheTag } from "next/cache";
import { connection } from "next/server";
import { count } from "@/lib/calls";
import { publishPrice } from "./actions";

async function getPrice(asOf) {
  "use cache";
  cacheLife("hours");
  cacheTag("price");
  count("price");
  return `${asOf}: made at ${new Date().toISOString().slice(11, 19)}`;
}

async function Price() {
  await connection();
  return <p data-price="text">{await getPrice(new Date().toISOString().slice(0, 10))}</p>;
}

export default function PricePage() {
  return (
    <main className="mx-auto max-w-2xl p-4 md:p-8">
      <h1 className="text-3xl font-semibold">Price</h1>
      <Suspense fallback={<p>Loading...</p>}>
        <Price />
      </Suspense>
      <form action={publishPrice}>
        <button id="publish" type="submit" className="rounded border px-3 py-1">
          publish
        </button>
      </form>
    </main>
  );
}
