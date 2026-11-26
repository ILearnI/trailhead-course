import { getTrail } from "@/dal/trails";

export async function GET(request, { params }) {
  const { slug } = await params;
  const trail = await getTrail(slug);
  if (!trail) return Response.json({ error: "No such trail" }, { status: 404 });
  return Response.json(trail);
}
