import { connection } from "next/server";

export const instant = false;

export default async function ConditionsPage() {
  await connection();
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const time = new Date().toLocaleTimeString();

  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="text-3xl font-semibold">Trail conditions</h1>
      <p className="mt-4 text-zinc-600">All trails are open today.</p>
      <p className="mt-2 text-sm text-zinc-500">{`Checked at ${time}`}</p>
    </main>
  );
}
