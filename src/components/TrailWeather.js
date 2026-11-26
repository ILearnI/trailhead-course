import { getRegionForecast } from "@/lib/forecast";

export default async function TrailWeather({ region }) {
  let forecast = null;
  try {
    forecast = await getRegionForecast(region);
  } catch {
    // The service failed: show the fallback below
  }

  if (!forecast) {
    return <p className="mt-2 text-sm text-muted">Forecast unavailable.</p>;
  }

  return (
    <p className="mt-2 text-sm">
      {`Forecast for the ${region}: ${forecast.summary}, ${forecast.temp} °C`}
    </p>
  );
}
