import "server-only";

const key = process.env.WEATHER_API_KEY;

export async function getForecast(region) {
  return { region, summary: "Clear skies", key: key ? "configured" : "missing" };
}
