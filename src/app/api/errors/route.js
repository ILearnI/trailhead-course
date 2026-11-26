import { connection } from "next/server";
import { clientKey } from "@/lib/ai-limits";
import { addReport, listReports, reportSchema, scrub } from "@/lib/error-report";
import { log } from "@/lib/logger";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request) {
  const key = `errors:${clientKey(request.headers)}`;
  if (!rateLimit(key, { limit: 30, windowMs: 60_000 }).ok) {
    return new Response(null, { status: 429 });
  }
  let body;
  try {
    body = JSON.parse(await request.text());
  } catch {
    return new Response(null, { status: 400 });
  }
  const parsed = reportSchema.safeParse(body);
  if (!parsed.success) return new Response(null, { status: 400 });
  const { url, ...rest } = parsed.data;
  addReport({ ...rest, kind: "client", url: url && scrub(url) });
  log.warn("client error", { message: rest.message, url });
  return new Response(null, { status: 204 });
}

export async function GET(request) {
  const secret = process.env.ANALYTICS_SECRET;
  if (!secret || request.headers.get("x-analytics-secret") !== secret) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connection();
  return Response.json(listReports());
}
