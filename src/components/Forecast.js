import { getForecast } from "@/lib/weather";

export default async function Forecast() {
  const forecast = await getForecast("alps");

  return (
    <p className="mt-2 text-sm text-zinc-500">
      {`Forecast for the alps: ${forecast.summary}. API key: ${forecast.key}.`}
    </p>
  );
}
