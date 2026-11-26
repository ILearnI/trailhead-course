import { listTrails } from "@/dal/trails";
import { apiError, apiJson, requireClient } from "@/lib/api-v1";
import { paginate, readPaging } from "@/lib/paginate";

const REGIONS = ["alps", "coast", "forest"];
const LEVELS = ["Easy", "Moderate", "Hard"];

export async function GET(request) {
  const { response } = requireClient(request);
  if (response) return response;

  const { searchParams } = new URL(request.url);
  const region = searchParams.get("region");
  const level = searchParams.get("level");
  if (region && !REGIONS.includes(region)) {
    return apiError(request, 400, "invalid_region", "Unknown region");
  }
  if (level && !LEVELS.includes(level)) {
    return apiError(request, 400, "invalid_level", "Unknown level");
  }

  let items = await listTrails();
  if (region) items = items.filter((trail) => trail.region === region);
  if (level) items = items.filter((trail) => trail.level === level);
  return apiJson(request, paginate(items, readPaging(searchParams)));
}
