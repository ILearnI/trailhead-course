export async function GET(request) {
  const wantsText = request.headers.get("accept")?.includes("text/plain");
  if (wantsText) {
    return new Response("Hello from Trailhead\n", {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
  return Response.json({ message: "Hello from Trailhead" });
}
