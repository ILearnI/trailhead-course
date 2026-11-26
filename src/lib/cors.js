// The origins that may call the api from a browser
function allowedOrigins() {
  return (process.env.ALLOWED_ORIGINS ?? "").split(",").filter(Boolean);
}

// The CORS headers: none for a stranger
export function corsHeaders(request) {
  const origin = request.headers.get("origin");
  if (!origin || !allowedOrigins().includes(origin)) return {};
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Headers": "content-type, x-api-key",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    // The answer depends on the origin
    Vary: "Origin",
  };
}
