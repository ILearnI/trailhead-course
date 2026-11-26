import { connection } from "next/server";

const NAMES = ["TTFB", "FCP", "LCP", "INP", "CLS"];
// The last values of each metric, no person
const samples = (globalThis.vitalSamples ??= {});

export async function POST(request) {
  let body;
  try {
    body = JSON.parse(await request.text());
  } catch {
    return new Response(null, { status: 400 });
  }
  const { name, value } = body ?? {};
  if (!NAMES.includes(name) || typeof value !== "number") {
    return new Response(null, { status: 400 });
  }
  const list = (samples[name] ??= []);
  list.push(value);
  // Keep the last 100
  if (list.length > 100) list.shift();
  return new Response(null, { status: 204 });
}

// The middle value of each metric
export async function GET(request) {
  const secret = process.env.ANALYTICS_SECRET;
  if (!secret || request.headers.get("x-analytics-secret") !== secret) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connection();
  const median = (list) => [...list].sort((a, b) => a - b)[Math.floor(list.length / 2)];
  const report = {};
  for (const [name, list] of Object.entries(samples)) {
    report[name] = { median: median(list), count: list.length };
  }
  return Response.json(report);
}
