import { listTrails } from "@/dal/trails";
import { findClient } from "@/lib/api-keys";
import { corsHeaders } from "@/lib/cors";

// The answer to a preflight: no body
export async function OPTIONS(request) {
  return new Response(null, { status: 204, headers: corsHeaders(request) });
}

export async function GET(request) {
  const client = findClient(request);
  if (!client) {
    return Response.json(
      { error: "A valid API key is required" },
      {
        status: 401,
        headers: { ...corsHeaders(request), "WWW-Authenticate": "ApiKey" },
      },
    );
  }
  const items = await listTrails();
  return Response.json(
    { client, count: items.length, items },
    { headers: corsHeaders(request) },
  );
}
