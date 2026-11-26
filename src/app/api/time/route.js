import { cacheLife } from "next/cache";

export async function GET() {
  return Response.json(
    { time: await readClock() },
    { headers: { "Cache-Control": "public, s-maxage=10" } },
  );
}

// A cached helper, outside the handler
async function readClock() {
  "use cache";
  cacheLife({ revalidate: 5, expire: 60 });
  return new Date().toISOString().slice(11, 19);
}
