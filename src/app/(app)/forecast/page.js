import { Suspense } from "react";
import TrailWeather from "@/components/TrailWeather";

async function Forecast({ searchParams }) {
  const { region = "alps" } = await searchParams;
  return <TrailWeather region={region} />;
}

export default function ForecastPage({ searchParams }) {
  return (
    <main className="mx-auto max-w-3xl p-4 md:p-8">
      <h1 className="text-3xl font-semibold">Forecast</h1>
      <Suspense fallback={<p>Loading...</p>}>
        <Forecast searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
