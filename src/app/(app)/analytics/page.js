import { Suspense } from "react";
import { connection } from "next/server";
import { getByRegion, getNewest, getRecent, getTotals } from "@/dal/analytics";

function Card({ title, children }) {
  return (
    <section className="rounded border p-4">
      <h2 className="font-semibold">{title}</h2>
      {children}
    </section>
  );
}

async function Totals() {
  const t = await getTotals();
  const text = `${t.reviews} reviews, ${t.trailCount} trails, average ${t.average}`;
  return (
    <Card title="Totals">
      <p data-widget="totals">{text}</p>
      <small data-at="totals">{`made at ${t.at}`}</small>
    </Card>
  );
}

async function Regions() {
  const r = await getByRegion();
  const text = r.rows.map((x) => `${x.region} ${x.reviews}`).join(", ");
  return (
    <Card title="By region">
      <p data-widget="regions">{text}</p>
      <small data-at="regions">{`made at ${r.at}`}</small>
    </Card>
  );
}

async function Newest() {
  const n = await getNewest();
  return (
    <Card title="Newest trails">
      <p data-widget="newest">{n.rows.map((x) => x.name).join(", ")}</p>
      <small data-at="newest">{`made at ${n.at}`}</small>
    </Card>
  );
}

async function Recent() {
  await connection();
  const value = await getRecent();
  return (
    <Card title="Last 5 minutes">
      <p data-widget="recent">{`${value} new reviews`}</p>
    </Card>
  );
}

export default function AnalyticsPage() {
  return (
    <main className="mx-auto max-w-3xl p-4 md:p-8">
      <h1 className="text-3xl font-semibold">Analytics</h1>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Totals />
        <Regions />
        <Newest />
        <Suspense fallback={<Card title="Last 5 minutes">...</Card>}>
          <Recent />
        </Suspense>
      </div>
    </main>
  );
}
