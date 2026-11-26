import { connection } from "next/server";

// Views by path: no person, kept in memory
const views = (globalThis.analyticsViews ??= new Map());

export async function POST(request) {
  let body;
  try {
    body = JSON.parse(await request.text());
  } catch {
    return new Response(null, { status: 400 });
  }
  const path = body?.path;
  const valid = typeof path === "string" && path.startsWith("/");
  if (!valid || path.length > 200) return new Response(null, { status: 400 });
  views.set(path, (views.get(path) ?? 0) + 1);
  return new Response(null, { status: 204 });
}

export async function GET(request) {
  const secret = process.env.ANALYTICS_SECRET;
  if (!secret || request.headers.get("x-analytics-secret") !== secret) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connection();
  return Response.json(Object.fromEntries(views));
}
