import { preferredLanguage } from "@/lib/request-info";

export async function GET(request) {
  const url = new URL(request.url);
  return Response.json({
    method: request.method,
    path: url.pathname,
    query: Object.fromEntries(url.searchParams),
    language: await preferredLanguage(),
  });
}
