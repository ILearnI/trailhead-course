import { findClient } from "@/lib/api-keys";
import { corsHeaders } from "@/lib/cors";

// A success: json, version, CORS headers
export function apiJson(request, body, status = 200) {
  const headers = { ...corsHeaders(request), "X-API-Version": "1" };
  return Response.json(body, { status, headers });
}

// An error, always in the same shape
export function apiError(request, status, code, message) {
  return apiJson(request, { error: { code, message } }, status);
}

// A trail, as the contract of version one says
export function publicTrail(trail) {
  const { id, slug, name, description, region, level, km, createdAt } = trail;
  return { id, slug, name, description, region, level, km, createdAt };
}

// The client of the key, or an error to return
export function requireClient(request) {
  const client = findClient(request);
  if (client) return { client };
  return { response: apiError(request, 401, "invalid_key", "A valid API key is required") };
}
