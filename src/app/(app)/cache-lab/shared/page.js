import { Suspense } from "react";
import { cacheLife, cacheTag } from "next/cache";
import { connection } from "next/server";

// Kept in Redis: every server sees the same entry
async function getShared() {
  "use cache: remote";
  cacheLife("hours");
  cacheTag("shared");
  return new Date().toISOString().slice(11, 19);
}

// Kept in the memory of one server
async function getLocal() {
  "use cache";
  cacheLife("hours");
  return new Date().toISOString().slice(11, 19);
}

async function Line() {
  await connection();
  const text = `shared ${await getShared()}, local ${await getLocal()}`;
  return <p data-shared="line">{text}</p>;
}

export default function SharedPage() {
  return (
    <main className="mx-auto max-w-2xl p-4 md:p-8">
      <h1 className="text-3xl font-semibold">Shared cache</h1>
      <Suspense fallback={<p>Loading...</p>}>
        <Line />
      </Suspense>
    </main>
  );
}
