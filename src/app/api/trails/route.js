import { listTrails } from "@/dal/trails";

const REGIONS = ["alps", "coast", "forest"];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const region = searchParams.get("region");
  if (region && !REGIONS.includes(region)) {
    return Response.json({ error: "Unknown region" }, { status: 400 });
  }
  let items = await listTrails();
  if (region) items = items.filter((trail) => trail.region === region);
  return Response.json(
    { count: items.length, items },
    {
      headers: {
        "X-Total-Count": String(items.length),
        "Access-Control-Allow-Origin": "*",
      },
    },
  );
}
