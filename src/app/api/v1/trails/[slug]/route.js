import { getTrail } from "@/dal/trails";
import { apiError, apiJson, requireClient } from "@/lib/api-v1";

export async function GET(request, { params }) {
  const { response } = requireClient(request);
  if (response) return response;

  const { slug } = await params;
  const trail = await getTrail(slug);
  if (!trail) return apiError(request, 404, "not_found", "No such trail");
  return apiJson(request, { data: trail });
}
