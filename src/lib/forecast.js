import { cacheLife, cacheTag } from "next/cache";

const API = "http://localhost:4002";

export async function getRegionForecast(region) {
  "use cache";
  cacheLife("hours");
  cacheTag(`weather-${region}`);

  const response = await fetch(`${API}/weather?region=${region}`);
  // Never cache a failure: throw
  if (!response.ok) throw new Error(`Weather API: ${response.status}`);
  return response.json();
}
