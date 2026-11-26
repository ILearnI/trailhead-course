import { Suspense } from "react";
import Link from "next/link";
import { cacheLife, navigation } from "next/cache";
import { count } from "@/lib/calls";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function getTopic(name) {
  "use cache";
  cacheLife("hours");
  count(`topic:${name}`);
  await sleep(3000);
  return `Topic ${name}`;
}

async function getBody(name) {
  "use cache";
  cacheLife("hours");
  count(`body:${name}`);
  await sleep(3000);
  return `Body of ${name}`;
}

async function Topic({ searchParams }) {
  const { name } = await searchParams;
  return <h2 data-topic="title">{await getTopic(name)}</h2>;
}

async function Body({ searchParams }) {
  const { name } = await searchParams;
  // Not before the click
  await navigation();
  return <p data-topic="body">{await getBody(name)}</p>;
}

export default function TopicPage({ searchParams }) {
  return (
    <main className="mx-auto max-w-2xl p-4 md:p-8">
      <h1 className="text-3xl font-semibold">Topic</h1>
      <Suspense fallback={<h2 data-topic="loading">Loading title...</h2>}>
        <Topic searchParams={searchParams} />
      </Suspense>
      <Suspense fallback={<p data-topic="loading">Loading body...</p>}>
        <Body searchParams={searchParams} />
      </Suspense>
      <Link id="back" href="/cache-lab" className="underline">
        Back to the lab
      </Link>
    </main>
  );
}
